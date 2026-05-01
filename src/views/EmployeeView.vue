<script setup>
import { reactive, onMounted } from "vue";
import { useRoute, RouterLink, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { ClipLoader } from "vue-spinner";
import axios from "axios";

// Access current route and router instance
const route = useRoute();
const router = useRouter();

const toast = useToast();

// Get employee ID from route parameters
const employeeId = route.params.id;

// Component state
// - employee: stores fetched employee data
// - isLoading: controls loading spinner visibility
const state = reactive({
  employee: {},
  isLoading: true,
});

/**
 * Delete employee by ID
 * Includes confirmation dialog before deletion
 */
const deleteEmployee = async () => {
  try {
    const confirm = window.confirm(
      "Are you sure you want to delete this employee?",
    );
    if (confirm) {
      // Send delete request to API
      await axios.delete(`/api/employees/${employeeId}`);

      toast.success("Employee Deleted Successfuly");

      // Redirect back to employees list
      router.push("/");
    }
  } catch (error) {
    // Handle delete request failure
    console.log("Error deleting employee", error);
    toast.error("Employee Not Deleted");
  }
};

/**
 * Fetch employee details when component mounts
 */
onMounted(async () => {
  try {
    // Get employee data using route ID
    const response = await axios.get(`/api/employees/${employeeId}`);

    state.employee = response.data;
  } catch (error) {
    // Handle fetch failure
    console.error("Error fetching employee", error);
  } finally {
    // Hide loading state after request completes
    state.isLoading = false;
  }
});
</script>

<template>
  <!-- Loading state -->
  <div v-if="state.isLoading" class="flex justify-center gap-3 py-6">
    <span class="text-white">Loading..</span>
    <ClipLoader color="#fff" />
  </div>

  <!-- Employee details content -->
  <div v-else>
    <!-- Page title -->
    <h2 class="text-center text-white text-2xl mt-3">Employee Details</h2>

    <!-- Employee information card -->
    <div
      class="border w-[95%] sm:w-[70%] md:w-[50%] lg:w-[40%] mx-auto rounded-lg text-white text-center p-3 my-3"
    >
      <!-- Employee basic information -->
      <p class="text-md">Employee code: {{ state.employee.code }}</p>
      <p class="text-md">Employee full name: {{ state.employee.fullName }}</p>
      <p class="text-md">
        Employee occupation: {{ state.employee.occupation }}
      </p>
      <p class="text-md">
        Employee department: {{ state.employee.department }}
      </p>

      <!-- Employment date -->
      <!-- Shows fallback text if no date exists -->
      <p class="text-md">
        Employee date of employment:
        {{
          state.employee.dateOfEmployment === "" ||
          state.employee.dateOfEmployment === null
            ? "No date selected"
            : state.employee.dateOfEmployment
        }}
      </p>

      <!-- Termination date -->
      <!-- Shows fallback text if no date exists -->
      <p class="text-md">
        Employee termination date:
        {{
          state.employee.terminationDate === "" ||
          state.employee.terminationDate === null
            ? "No date selected"
            : state.employee.terminationDate
        }}
      </p>

      <!-- Action buttons -->
      <div class="flex justify-center gap-3 mt-3">
        <!-- Navigate to edit employee page -->
        <RouterLink
          :to="`/employee/edit/${employeeId}`"
          class="text-md border hover:border-gray-500 hover:bg-gray-900 px-4 py-2 rounded"
        >
          Edit Employee
        </RouterLink>

        <!-- Delete employee action -->
        <button
          type="button"
          class="text-md border hover:border-gray-500 hover:bg-gray-900 px-4 py-2 rounded"
          @click="deleteEmployee"
        >
          Delete Employee
        </button>
      </div>
    </div>
  </div>
</template>
