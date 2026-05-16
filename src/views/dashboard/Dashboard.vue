<script src="./index.ts" lang="ts"></script>

<template>
  <v-container fluid class="pa-6">
    <div class="d-flex align-center justify-space-between mb-6">
      <h1 class="text-h5 font-weight-bold">Dashboard Financiero</h1>
      <MonthYearSelector
        v-model:month="selectedMonth"
        v-model:year="selectedYear"
      />
    </div>

    <SummaryCards
      :total-income="totalIncome"
      :total-spent="totalSpent"
      :total-saved="totalSaved"
      :balance="balance"
      :categories="categories"
      @add-transaction="onAddTransaction"
    />

    <v-row class="mt-2">
      <v-col cols="12" md="6">
        <SavingGoals :saving-goals="savingGoals" @add-goal="onAddGoal" />
      </v-col>
      <v-col cols="12" md="6">
        <SavingPlatforms :platforms="platforms" :total-platforms="totalPlatforms" @add-platform="onAddPlatform" @deposit-platform="onDepositPlatform" />
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <v-col cols="12">
        <ExpenseCategories :categories="categories" :total-spent="totalSpent" />
      </v-col>
    </v-row>
  </v-container>
</template>
