<script setup>
import { RouterLink } from "vue-router";
import { reactive, ref, computed, onMounted } from "vue";
import { ClipLoader } from "vue-spinner";
import { useToast } from "vue-toastification";
import axios from "axios";

// Global state for employees data + loading indicator
const state = reactive({
  employees: [],
  isLoading: true,
});

// Search / filter state
const searchQuery = ref(""); // user search input
const filterKey = ref(""); // selected field to filter by

// Sorting state
const sortKey = ref(""); // field to sort by
const sortOrder = ref("asc"); // asc or desc

// Pagination State
const currentPage = ref(1);
const itemsPerPage = 10;

const toast = useToast();

/**
 * Returns human-readable employment status
 * based on employment date comparison with today
 */
const getEmploymentStatus = (dateOfEmployment) => {
  if (!dateOfEmployment) {
    return "No date selected";
  }

  const today = new Date();
  const employmentDate = new Date(dateOfEmployment);

  // Normalize time to avoid time comparison issues
  today.setHours(0, 0, 0, 0);
  employmentDate.setHours(0, 0, 0, 0);

  if (employmentDate > today) {
    return "Employed soon";
  }

  return "Currently employed";
};

/**
 * Returns termination status based on termination date
 */
const getTerminationStatus = (terminationDate) => {
  if (!terminationDate) {
    return "No date selected";
  }

  const today = new Date();
  const terminatedDate = new Date(terminationDate);

  today.setHours(0, 0, 0, 0);
  terminatedDate.setHours(0, 0, 0, 0);

  if (terminatedDate > today) {
    return "To be terminated";
  }

  return "Terminated";
};

/**
 * Computed:
 * Applies filtering + searching + sorting on employees list
 */
const filteredEmployees = computed(() => {
  let data = state.employees.filter((emp) => {
    const query = searchQuery.value.toLowerCase();

    let value = "";

    // Determine which field to filter by
    if (filterKey.value === "fullName") value = emp.fullName;
    if (filterKey.value === "occupation") value = emp.occupation;
    if (filterKey.value === "department") value = emp.department;
    if (filterKey.value === "employmentStatus")
      value = getEmploymentStatus(emp.dateOfEmployment);
    if (filterKey.value === "terminationStatus")
      value = getTerminationStatus(emp.terminationDate);

    // Global search (no filter selected)
    if (!filterKey.value) {
      return Object.values(emp).some((v) =>
        String(v).toLowerCase().includes(query),
      );
    }

    // Filtered search
    return value.toLowerCase().includes(query);
  });

  // Sorting logic
  if (!sortKey.value) return data;

  return data.sort((a, b) => {
    let aVal = a[sortKey.value];
    let bVal = b[sortKey.value];

    if (typeof aVal === "string") {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return sortOrder.value === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder.value === "asc" ? 1 : -1;

    return 0;
  });
});

/**
 * Total number of pages based on filtered results
 */
const totalPages = computed(() => {
  return Math.ceil(filteredEmployees.value.length / itemsPerPage);
});

/**
 * Returns only employees for the current page
 */
const paginatedEmployees = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return filteredEmployees.value.slice(start, end);
});

/**
 * Handles pagination navigation
 */
const changePage = (page) => {
  if (page < 1 || page > totalPages.value) {
    return;
  }

  currentPage.value = page;
};

/**
 * Delete employee with confirmation + UI update
 */
const deleteEmployee = async (employeeId) => {
  try {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?",
    );

    if (!confirmDelete) {
      return;
    }

    // API call to delete employee
    await axios.delete(`/api/employees/${employeeId}`);

    // Remove deleted employee from local state
    state.employees = state.employees.filter(
      (employee) => employee.id !== employeeId,
    );

    // Fix pagination if current page becomes invalid
    if (currentPage.value > totalPages.value && currentPage.value > 1) {
      currentPage.value--;
    }

    toast.success("Employee Deleted Successfully");
  } catch (error) {
    console.log("Error Deleting Employee", error);

    toast.error("Employee Was Not Deleted");
  }
};

/**
 * Fetch employees on component mount
 */
onMounted(async () => {
  try {
    const response = await axios.get("/api/employees");
    state.employees = response.data;
  } catch (error) {
    console.error("Error fetching employees", error);
  } finally {
    state.isLoading = false;
  }
});
</script>

<template>
  <!-- Loading state (shown while API request is in progress) -->
  <div v-if="state.isLoading" class="flex justify-center gap-3 py-6">
    <span class="text-white">Loading..</span>
    <ClipLoader color="#fff" />
  </div>

  <!-- Main content (shown after data is loaded) -->
  <div v-else class="w-[95%] mx-auto my-5 text-white">
    <!-- Filter + Sort Controls Section -->
    <div
      class="grid grid-cols-1l sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 mb-5"
    >
      <!-- Global search input -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search..."
        class="focus:border-none focus:outline-none p-2 rounded bg-gray-500"
      />

      <!-- Filter by specific field -->
      <select
        v-model="filterKey"
        class="focus:border-none focus:outline-none p-2 rounded bg-gray-500 cursor-pointer"
      >
        <option value="">Search All</option>
        <option value="fullName">Full Name</option>
        <option value="occupation">Occupation</option>
        <option value="department">Department</option>
        <option value="employmentStatus">Employment Status</option>
        <option value="terminationStatus">Termination Status</option>
      </select>

      <!-- Sort field selector -->
      <select
        v-model="sortKey"
        class="focus:border-none focus:outline-none p-2 rounded bg-gray-500 cursor-pointer"
      >
        <option value="">No Sorting</option>
        <option value="fullName">Full Name</option>
        <option value="occupation">Occupation</option>
        <option value="department">Department</option>
      </select>

      <!-- Sort direction selector -->
      <select
        v-model="sortOrder"
        class="focus:border-none focus:outline-none p-2 rounded bg-gray-500 cursor-pointer"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>

    <!-- Table wrapper (enables horizontal scroll on small screens) -->
    <div class="overflow-x-auto">
      <table class="min-w-full">
        <!-- Table header -->
        <thead class="bg-gray-400">
          <tr>
            <th class="p-2 text-center text-md border border-gray-900">
              Full Name
            </th>
            <th class="p-2 text-center text-md border border-gray-900">
              Occupation
            </th>
            <th class="p-2 text-center text-md border border-gray-900">
              Department
            </th>
            <th class="p-2 text-center text-md border border-gray-900">
              Date of Employment
            </th>
            <th class="p-2 text-center text-md border border-gray-900">
              Termination Date
            </th>
            <th class="p-2 text-center text-md border border-gray-900">
              Actions
            </th>
          </tr>
        </thead>

        <!-- Table body -->
        <tbody>
          <tr v-for="employee in paginatedEmployees" :key="employee.id">
            <!-- Employee full name -->
            <td class="p-2 text-center text-sm border border-gray-900">
              {{ employee.fullName }}
            </td>

            <!-- Employee occupation -->
            <td class="p-2 text-center text-sm border border-gray-900">
              {{ employee.occupation }}
            </td>

            <!-- Employee department -->
            <td class="p-2 text-center text-sm border border-gray-900">
              {{ employee.department }}
            </td>

            <!-- Derived employment status (computed from date) -->
            <td class="p-2 text-center text-sm border border-gray-900">
              {{ getEmploymentStatus(employee.dateOfEmployment) }}
            </td>

            <!-- Derived termination status (computed from date) -->
            <td class="p-2 text-center text-sm border border-gray-900">
              {{ getTerminationStatus(employee.terminationDate) }}
            </td>

            <!-- Actions column (view / edit / delete) -->
            <td class="p-2 text-sm border border-gray-900">
              <div class="flex justify-around">
                <!-- View employee details -->
                <div class="relative inline-block group">
                  <span class="cursor-pointer">
                    <RouterLink :to="`/employee/${employee.id}`">
                      <i class="pi pi-eye"></i>
                    </RouterLink>
                  </span>

                  <!-- Tooltip -->
                  <div
                    class="absolute hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded -top-10 right-0"
                  >
                    View Employee
                  </div>
                </div>

                <!-- Edit employee -->
                <div class="relative inline-block group">
                  <span class="cursor-pointer">
                    <RouterLink :to="`/employee/edit/${employee.id}`">
                      <i class="pi pi-user-edit"></i>
                    </RouterLink>
                  </span>
                  <!-- Tooltip -->
                  <div
                    class="absolute hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded -top-10 right-0"
                  >
                    Edit Employee
                  </div>
                </div>

                <!-- Delete employee -->
                <div class="relative inline-block group">
                  <span class="cursor-pointer">
                    <button @click="deleteEmployee(employee.id)">
                      <i class="pi pi-user-minus"></i>
                    </button>
                  </span>
                  <!-- Tooltip -->
                  <div
                    class="absolute hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded -top-10 right-0"
                  >
                    Delete Employee
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>

        <!-- Pagination controls -->
        <tfoot>
          <tr>
            <td colspan="6" class="border border-gray-900 p-4">
              <div class="flex justify-between items-center">
                <!-- Previous page button -->
                <button
                  @click="changePage(currentPage - 1)"
                  :disabled="currentPage === 1"
                  :class="`border ${currentPage != 1 && 'hover:border-gray-500 hover:bg-gray-900'} px-4 py-2 rounded disabled:opacity-50 text-sm`"
                >
                  Previous
                </button>

                <!-- Current page indicator -->
                <span class="text-sm">
                  Page {{ currentPage }} of {{ totalPages }}
                </span>

                <!-- Next page button -->
                <button
                  @click="changePage(currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  :class="`border ${currentPage != totalPages && 'hover:border-gray-500 hover:bg-gray-900'} px-4 py-2 rounded disabled:opacity-50 text-sm`"
                >
                  Next
                </button>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Create new employee button -->
    <div class="flex justify-end w-100 mt-3">
      <RouterLink
        to="/employee/create"
        class="text-sm border hover:border-gray-500 hover:bg-gray-900 px-4 py-2 rounded"
      >
        Create Employee
      </RouterLink>
    </div>
  </div>
</template>
