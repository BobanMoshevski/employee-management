<script setup>
import router from "@/router";
import { reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import { ClipLoader } from "vue-spinner";
import axios from "axios";

const route = useRoute();

const employeeId = route.params.id;

const form = reactive({
  code: "",
  fullName: "",
  occupation: "",
  department: "",
  dateOfEmployment: "",
  terminationDate: "",
});

const state = reactive({
  employee: {},
  isLoading: true,
});

// Validation Errors
const errors = reactive({
  code: "",
  fullName: "",
  occupation: "",
  department: "",
});

const toast = useToast();

const handleSubmit = async () => {
  // Reset Errors
  errors.code = "";
  errors.fullName = "";
  errors.occupation = "";
  errors.department = "";

  let hasError = false;

  if (!form.code) {
    errors.code = "Employee code is required";
    hasError = true;
  }

  if (!form.fullName) {
    errors.fullName = "Full name is required";
    hasError = true;
  }

  if (!form.occupation) {
    errors.occupation = "Occupation is required";
    hasError = true;
  }

  if (!form.department) {
    errors.department = "Department is required";
    hasError = true;
  }

  if (hasError) {
    return;
  }

  const updateEmployee = {
    code: form.code.toUpperCase(),
    fullName: form.fullName,
    occupation: form.occupation,
    department: form.department,
    dateOfEmployment: form.dateOfEmployment,
    terminationDate: form.terminationDate,
  };

  try {
    const response = await axios.put(
      `/api/employees/${employeeId}`,
      updateEmployee,
    );
    toast.success("Employee Updated Successfuly");
    router.push(`/employee/${response.data.id}`);
  } catch (error) {
    console.error("Error fetching employees", error);
    toast.error("Employee Was Not Updated");
  }
};

const discardEmployee = async () => {
  const confirm = window.confirm(
    "Are you sure you want to discard the employee information?",
  );
  if (confirm) {
    toast.success("Employee information is discarded");
    router.push("/");
  }
};

onMounted(async () => {
  try {
    const response = await axios.get(`/api/employees/${employeeId}`);
    state.employee = response.data;
    // Populate inputs
    form.code = state.employee.code;
    form.fullName = state.employee.fullName;
    form.occupation = state.employee.occupation;
    form.department = state.employee.department;
    form.dateOfEmployment = state.employee.dateOfEmployment;
    form.terminationDate = state.employee.terminationDate;
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

  <div v-else class="w-[95%] md:w-[70%] lg:w-[50%] mx-auto text-white my-5">
    <form class="border rounded-lg p-5" @submit.prevent="handleSubmit">
      <h2 class="text-3xl text-center font-semibold mb-6">Edit Employee</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-bold mb-2"> Employee Code </label>
          <input
            type="text"
            v-model="form.code"
            id="code"
            name="code"
            class="focus:border-none focus:outline-none p-2 rounded bg-gray-500 w-[100%]"
            placeholder="Employee code"
          />
          <p v-if="errors.code" class="text-red-500 text-sm mt-1">
            {{ errors.code }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-bold mb-2"> Full Name </label>
          <input
            type="text"
            v-model="form.fullName"
            id="fullName"
            name="fullName"
            class="focus:border-none focus:outline-none p-2 rounded bg-gray-500 w-[100%]"
            placeholder="Full Name"
          />
          <p v-if="errors.fullName" class="text-red-500 text-sm mt-1">
            {{ errors.fullName }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-bold mb-2"> Occupation </label>
          <input
            type="text"
            v-model="form.occupation"
            id="occupation"
            name="occupation"
            class="focus:border-none focus:outline-none p-2 rounded bg-gray-500 w-[100%]"
            placeholder="Occupation"
          />
          <p v-if="errors.occupation" class="text-red-500 text-sm mt-1">
            {{ errors.occupation }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-bold mb-2"> Department </label>
          <input
            type="text"
            v-model="form.department"
            id="department"
            name="department"
            class="focus:border-none focus:outline-none p-2 rounded bg-gray-500 w-[100%]"
            placeholder="Department"
          />
          <p v-if="errors.department" class="text-red-500 text-sm mt-1">
            {{ errors.department }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-bold mb-2">
            Date Of Employment
          </label>
          <input
            type="date"
            v-model="form.dateOfEmployment"
            id="dateOfEmployment"
            name="dateOfEmployment"
            class="focus:border-none focus:outline-none p-2 rounded bg-gray-500 w-[100%]"
            placeholder="Date Of Employment"
          />
        </div>
        <div>
          <label class="block text-sm font-bold mb-2"> Termination Date </label>
          <input
            type="date"
            v-model="form.terminationDate"
            id="terminationDate"
            name="terminationDate"
            class="focus:border-none focus:outline-none p-2 rounded bg-gray-500 w-[100%]"
            placeholder="Termination Date"
          />
        </div>
      </div>
      <div class="flex justify-center gap-3 mt-5">
        <button
          class="text-sm border hover:border-gray-500 hover:bg-gray-900 px-4 py-2 rounded"
          type="submit"
        >
          Save
        </button>
        <button
          class="text-sm border hover:border-gray-500 hover:bg-gray-900 px-4 py-2 rounded"
          type="button"
          @click="discardEmployee"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>
