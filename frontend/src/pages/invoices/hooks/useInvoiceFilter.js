import { useMemo, useState } from "react";

export const useInvoiceFilter = (invoices) => {
  const [filter, setFilter] = useState("ALL");

  const filteredInvoices = useMemo(() => {
    if (filter === "ALL") return invoices;

    return invoices.filter((inv) => inv.status === filter);
  }, [filter, invoices]);

  return {
    filter,
    setFilter,
    filteredInvoices,
  };
};
