<script setup>
import { RouterLink } from "vue-router";
import { reactive, ref, computed, onMounted } from "vue";
import { ClipLoader } from "vue-spinner";
import axios from "axios";

const state = reactive({
  employees: [],
  isLoading: true,
});

// Filter State
const searchQuery = ref("");
const filterKey = ref("");

// Sort State
const sortKey = ref("");
const sortOrder = ref("asc");

// Pagination State
const currentPage = ref(1);
const itemsPerPage = 10;

// Employment Status
const getEmploymentStatus = (dateOfEmployment) => {
  if (!dateOfEmployment) {
    return "No date selected";
  }

  const today = new Date();
  const employmentDate = new Date(dateOfEmployment);

  today.setHours(0, 0, 0, 0);
  employmentDate.setHours(0, 0, 0, 0);

  if (employmentDate > today) {
    return "Employed soon";
  }

  return "Currently employed";
};

// Termination Status
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

// Filter + Sort Logic
const filteredEmployees = computed(() => {
  let data = state.employees.filter((emp) => {
    const query = searchQuery.value.toLowerCase();

    let value = "";

    if (filterKey.value === "fullName") value = emp.fullName;
    if (filterKey.value === "occupation") value = emp.occupation;
    if (filterKey.value === "department") value = emp.department;
    if (filterKey.value === "employmentStatus")
      value = getEmploymentStatus(emp.dateOfEmployment);
    if (filterKey.value === "terminationStatus")
      value = getTerminationStatus(emp.terminationDate);

    if (!filterKey.value) {
      return Object.values(emp).some((v) =>
        String(v).toLowerCase().includes(query),
      );
    }

    return value.toLowerCase().includes(query);
  });

  // Sorting
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

// Total Pages
const totalPages = computed(() => {
  return Math.ceil(filteredEmployees.value.length / itemsPerPage);
});

// Paginated Employees
const paginatedEmployees = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return filteredEmployees.value.slice(start, end);
});

// Change Page
const changePage = (page) => {
  if (page < 1 || page > totalPages.value) {
    return;
  }

  currentPage.value = page;
};

// Fetch Data
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
  <div v-if="state.isLoading" class="flex justify-center gap-3 py-6">
    <span class="text-white">Loading..</span>
    <ClipLoader color="#fff" />
  </div>

  <div v-else class="w-[95%] mx-auto my-5 text-white">
    <!-- Filter + Sort Controls -->
    <div
      class="grid grid-cols-1l sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 mb-5"
    >
      <!-- Search -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search..."
        class="focus:border-none focus:outline-none p-2 rounded bg-gray-500"
      />

      <!-- Filter Field -->
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

      <!-- Sort Field -->
      <select
        v-model="sortKey"
        class="focus:border-none focus:outline-none p-2 rounded bg-gray-500 cursor-pointer"
      >
        <option value="">No Sorting</option>
        <option value="fullName">Full Name</option>
        <option value="occupation">Occupation</option>
        <option value="department">Department</option>
      </select>

      <!-- Sort Order -->
      <select
        v-model="sortOrder"
        class="focus:border-none focus:outline-none p-2 rounded bg-gray-500 cursor-pointer"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full">
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

        <tbody>
          <tr v-for="employee in paginatedEmployees" :key="employee.id">
            <td class="p-2 text-center text-sm border border-gray-900">
              {{ employee.fullName }}
            </td>
            <td class="p-2 text-center text-sm border border-gray-900">
              {{ employee.occupation }}
            </td>
            <td class="p-2 text-center text-sm border border-gray-900">
              {{ employee.department }}
            </td>
            <td class="p-2 text-center text-sm border border-gray-900">
              {{ getEmploymentStatus(employee.dateOfEmployment) }}
            </td>
            <td class="p-2 text-center text-sm border border-gray-900">
              {{ getTerminationStatus(employee.terminationDate) }}
            </td>
            <td class="p-2 text-sm border border-gray-900">
              <div class="flex justify-around">
                <!-- Employee View -->
                <div class="relative inline-block group">
                  <span class="cursor-pointer">
                    <RouterLink :to="`/employee/${employee.id}`">
                      <i class="pi pi-eye"></i>
                    </RouterLink>
                  </span>
                  <div
                    class="absolute hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded -top-10 right-0"
                  >
                    View Employee
                  </div>
                </div>

                <!-- Edit Employee -->
                <div class="relative inline-block group">
                  <span class="cursor-pointer">
                    <RouterLink :to="`/employee/edit/${employee.id}`">
                      <i class="pi pi-user-edit"></i>
                    </RouterLink>
                  </span>
                  <div
                    class="absolute hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded -top-10 right-0"
                  >
                    Edit Employee
                  </div>
                </div>

                <!-- Delete Employee -->
                <div class="relative inline-block group">
                  <span class="cursor-pointer">
                    <button>
                      <i class="pi pi-user-minus"></i>
                    </button>
                  </span>
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

        <!-- Pagination -->
        <tfoot>
          <tr>
            <td colspan="6" class="border border-gray-900 p-4">
              <div class="flex justify-between items-center">
                <button
                  @click="changePage(currentPage - 1)"
                  :disabled="currentPage === 1"
                  :class="`border ${currentPage != 1 && 'hover:border-gray-500 hover:bg-gray-900'} px-4 py-2 rounded disabled:opacity-50 text-sm`"
                >
                  Previous
                </button>

                <span class="text-sm">
                  Page {{ currentPage }} of {{ totalPages }}
                </span>

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
