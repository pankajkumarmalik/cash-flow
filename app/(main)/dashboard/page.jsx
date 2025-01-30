"use client";

import { getDashboardData, getUserAccounts } from "@/actions/dashboard";
import CreateAccountDrawer from "@/components/create-account-drawer";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import React, { Suspense, useEffect, useState } from "react";
import AccountCard from "./_components/account-card";
import { getCurrentBudget } from "@/actions/budget";
import BudgetProgress from "./_components/budget-progress";
import DashboardOverview from "./_components/transaction-overview";

const DashboardPage = () => {
  const [transactionData, setTransactionData] = useState([]);
  const [accountsData, setAccountsData] = useState([]);
  const [budgetData, setBudgetData] = useState(null);
  const [defaultAccountData, setDefaultAccountData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accounts = await getUserAccounts();
        setAccountsData(accounts);

        const defaultAccount = accounts?.find((account) => account.isDefault);
        setDefaultAccountData(defaultAccount);

        const transactions = await getDashboardData();
        setTransactionData(transactions);
        if (defaultAccount) {
          const budget = await getCurrentBudget(defaultAccount.id);
          setBudgetData(budget);
        }
      } catch (error) {
        console.log("fetchData error", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Budget Progress */}
      {defaultAccountData && (
        <BudgetProgress
          initialBudget={budgetData?.budget}
          currentExpenses={budgetData?.currentExpenses || 0}
        />
      )}

      {/* Overview */}
      <Suspense fallback={"Loading Overview..."}>
        <DashboardOverview
          accounts={accountsData}
          transactions={transactionData}
        />
      </Suspense>

      {/* Accounts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CreateAccountDrawer>
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
            <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
              <Plus className="h-10 w-10 mb-2" />
              <p className="text-sm font-medium">Add New Account</p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>

        {accountsData.length > 0 &&
          accountsData?.map((account) => {
            return <AccountCard key={account.id} account={account} />;
          })}
      </div>
    </div>
  );
};

export default DashboardPage;
