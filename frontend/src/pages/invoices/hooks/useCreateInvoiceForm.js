import { useState } from "react";
import { useInvoiceCalculator } from "./useInvoiceCalculator";
import { validateForm } from "../utils/invoiceValidation";
import { initialInvoiceFormData } from "../constants/initialInvoiceFormData";
import { buildInvoicePayload } from "../utils/buildInvoicePayload";
import { createInvoice } from "../services/invoiceApi";

export const useCreateInvoiceForm = (roomOptions, serviceOptions) => {
  const [formData, setFormData] = useState(initialInvoiceFormData);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    selectedRoom,
    selectedServiceFees,
    electricCost,
    waterCost,
    totalCost,
  } = useInvoiceCalculator(formData, roomOptions, serviceOptions);

  const clearFieldErrors = (fieldName) => {
    setErrors((prev) => {
      const nextErrors = { ...prev };
      delete nextErrors[fieldName];
      return nextErrors;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    clearFieldErrors(name);
    setSuccessMessage("");
  };

  const handleServiceChange = (serviceId) => {
    setFormData((prev) => {
      const isSelected = prev.selectedServices.includes(serviceId);

      return {
        ...prev,
        selectedServices: isSelected
          ? prev.selectedServices.filter((id) => id !== serviceId)
          : [...prev.selectedServices, serviceId],
      };
    });

    clearFieldErrors("selectedServices");
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setSubmitError("");

    const newErrors = validateForm(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = buildInvoicePayload(
        formData,
        selectedRoom,
        selectedServiceFees,
      );

      await createInvoice(payload);

      setSuccessMessage("Hóa đơn đã được tạo thành công!");
      console.log("Dữ liệu hóa đơn:", payload);
    } catch (error) {
      setSubmitError(error.message || "Không thể tạo hóa đơn");
    } finally {
      setIsSubmitting(false);
    }
  };
  const getInputClass = (fieldName) => {
    return `form-control form-control-custom ${errors[fieldName] ? "is-invalid" : ""}`;
  };

  const getSelectClass = (fieldName) => {
    return `form-select form-control-custom ${errors[fieldName] ? "is-invalid" : ""}`;
  };

  return {
    formData,
    errors,
    successMessage,
    submitError,
    isSubmitting,

    selectedRoom,
    electricCost,
    waterCost,
    totalCost,

    handleChange,
    handleServiceChange,
    handleSubmit,

    getInputClass,
    getSelectClass,
  };
};
