<script setup>
import router from "@/router";
import { reactive } from "vue";
import { useToast } from "vue-toastification";
import axios from "axios";

// Reactive form state (two-way bound to inputs)
const form = reactive({
  code: "",
  fullName: "",
  occupation: "",
  department: "",
  dateOfEmployment: "",
  terminationDate: "",
});

// Reactive object for form validation errors
// Each field stores its own error message
const errors = reactive({
  code: "",
  fullName: "",
  occupation: "",
  department: "",
});

const toast = useToast();

// Handle form submission
// Includes validation + API request + navigation
const handleSubmit = async () => {
  // Reset Errors
  errors.code = "";
  errors.fullName = "";
  errors.occupation = "";
  errors.department = "";

  let hasError = false;

  // Frontend validation checks
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

  // Stop submission if validation fails
  if (hasError) {
    return;
  }

  // Prepare payload for API request
  const newEmployee = {
    code: form.code.toUpperCase(),
    fullName: form.fullName,
    occupation: form.occupation,
    department: form.department,
    dateOfEmployment: form.dateOfEmployment,
    terminationDate: form.terminationDate,
  };

  try {
    // Send POST request to backend to create employee
    const response = await axios.post("/api/employees", newEmployee);
    toast.success("Employee Added Successfuly");

    // Redirect to newly created employee detail page
    router.push(`/employee/${response.data.id}`);
  } catch (error) {
    // Handle API error
    console.error("Error fetching employees", error);
    toast.error("Employee Was Not Added");
  }
};

// Cancel / discard form action
// Confirms with user before leaving the form
const discardEmployee = async () => {
  const confirm = window.confirm(
    "Are you sure you want to discard the employee information?",
  );
  if (confirm) {
    toast.success("Employee information is discarded");
    router.push("/");
  }
};
</script>

<template>
  <div class="w-[95%] md:w-[70%] lg:w-[50%] mx-auto text-white my-5">
    <form class="border rounded-lg p-5" @submit.prevent="handleSubmit">
      <!-- Page title -->
      <h2 class="text-3xl text-center font-semibold mb-6">Create Employee</h2>

      <!-- Form grid layout -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <!-- Employee Code -->
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

          <!-- Validation error -->
          <p v-if="errors.code" class="text-red-500 text-sm mt-1">
            {{ errors.code }}
          </p>
        </div>

        <!-- Full Name -->
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

        <!-- Occupation -->
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

        <!-- Department -->
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

        <!-- Date Of Employment -->
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

        <!-- Termination Date -->
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

      <!-- Action buttons -->
      <div class="flex justify-center gap-3 mt-5">
        <!-- Submit form -->
        <button
          class="text-sm border hover:border-gray-500 hover:bg-gray-900 px-4 py-2 rounded"
          type="submit"
        >
          Save
        </button>

        <!-- Cancel / discard form -->
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
