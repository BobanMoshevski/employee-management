<template>
  <!-- Login form container -->
  <div
    class="border w-[95%] sm:w-[70%] md:w-[50%] lg:w-[30%] mx-auto rounded-lg text-white my-5 p-3"
  >
    <!-- Page title -->
    <h2 class="text-3xl text-center font-semibold">Log in</h2>

    <!-- Email input field -->
    <div class="mb-2">
      <label class="block text-sm font-bold mb-2"> Email </label>
      <input
        type="email"
        id="email"
        name="email"
        class="focus:border-none focus:outline-none p-2 rounded bg-gray-500 w-[100%]"
        placeholder="Email"
      />
    </div>

    <!-- Password input field -->
    <div>
      <label class="block text-sm font-bold mb-2"> Password </label>
      <input
        type="password"
        id="password"
        name="password"
        class="focus:border-none focus:outline-none p-2 rounded bg-gray-500 w-[100%]"
        placeholder="Password"
      />
    </div>
  </div>
</template>
