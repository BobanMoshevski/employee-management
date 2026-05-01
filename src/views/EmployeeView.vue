<script setup>
import { reactive, onMounted } from "vue";
import { useRoute, RouterLink, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { ClipLoader } from "vue-spinner";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const toast = useToast();

const employeeId = route.params.id;

const state = reactive({
  employee: {},
  isLoading: true,
});

const deleteJob = async () => {
  try {
    const confirm = window.confirm(
      "Are you sure you want to delete this employee?",
    );
    if (confirm) {
      await axios.delete(`/api/employees/${employeeId}`);
      toast.success("Employee Deleted Successfuly");
      router.push("/");
    }
  } catch (error) {
    console.log("Error deleting employee", error);
    toast.error("Employee Not Deleted");
  }
};

onMounted(async () => {
  try {
    const response = await axios.get(`/api/employees/${employeeId}`);
    state.employee = response.data;
  } catch (error) {
    console.error("Error fetching employee", error);
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
  <div v-else>
    <h2 class="text-center text-white text-2xl mt-3">Employee Details</h2>
    <div
      class="border w-[95%] sm:w-[70%] md:w-[50%] lg:w-[40%] mx-auto rounded-lg text-white text-center p-3 my-3"
    >
      <p class="text-md">Employee code: {{ state.employee.code }}</p>
      <p class="text-md">Employee full name: {{ state.employee.fullName }}</p>
      <p class="text-md">
        Employee occupation: {{ state.employee.occupation }}
      </p>
      <p class="text-md">
        Employee department: {{ state.employee.department }}
      </p>
      <p class="text-md">
        Employee date of employment:
        {{
          state.employee.dateOfEmployment === "" ||
          state.employee.terminationDate === null
            ? "No date selected"
            : state.employee.dateOfEmployment
        }}
      </p>
      <p class="text-md">
        Employee termination date:
        {{
          state.employee.terminationDate === "" ||
          state.employee.terminationDate === null
            ? "No date selected"
            : state.employee.terminationDate
        }}
      </p>

      <div class="flex justify-center gap-3 mt-3">
        <RouterLink
          :to="`/employee/edit/${employeeId}`"
          class="text-md border hover:border-gray-500 hover:bg-gray-900 px-4 py-2 rounded"
        >
          Edit Employee
        </RouterLink>
        <button
          type="button"
          class="text-md border hover:border-gray-500 hover:bg-gray-900 px-4 py-2 rounded"
          @click="deleteJob"
        >
          Delete Employee
        </button>
      </div>
    </div>
  </div>
</template>
