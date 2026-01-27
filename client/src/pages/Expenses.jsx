import React, { useState } from "react";
import ExpenseUpper from "../components/Expenses/ExpenseUpper";
import ExpenseMiddle from "../components/Expenses/ExpenseMiddle";
import ExpenseBottom from "../components/Expenses/ExpenseBottom";
import gsap from "gsap";
import { useSelector } from "react-redux";
import Navigation from "../components/Expenses/Navigation";
import ExpenHis from "../components/Expenses/ExpenHis";

const Expenses = () => {
  const [page, setPage] = useState("current");
  const tl = gsap.timeline();
  const today = new Date();
  let expenses = useSelector((state) => state.expenses.expenses);
  expenses = expenses.filter(
    (item) =>
      item.createdAt.month === today.getMonth() &&
      item.createdAt.year === today.getFullYear(),
  );
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);
  const handlePage = (str) => {
    setPage(str);
  };

  return (
    <div className="w-screen  px-8">
      <Navigation page={page} handlePage={handlePage} tl={tl} />
      {page === "current" ? (
        <>
          <ExpenseUpper tl={tl} total={total} />
          <ExpenseMiddle tl={tl} expenses={expenses} />
          <ExpenseBottom tl={tl} expenses={expenses} />
        </>
      ) : (
        <ExpenHis />
      )}
    </div>
  );
};

export default Expenses;
