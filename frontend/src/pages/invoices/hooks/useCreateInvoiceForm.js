import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useInvoiceCalculator } from "./useInvoiceCalculator";
import { validateForm } from "../utils/invoiceValidation";
import { initialInvoiceFormData } from "../constants/initialInvoiceFormData";
import { buildInvoicePayload } from "../utils/buildInvoicePayload";
import { createInvoice, getInvoicesByRoomId } from "../services/invoiceApi";

export const useCreateInvoiceForm = (roomOptions, serviceOptions) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialInvoiceFormData);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (formData.roomId) {
      getInvoicesByRoomId(formData.roomId)
        .then((invoices) => {
          if (invoices && invoices.length > 0) {
            const latestInvoice = [...invoices].sort((a, b) => {
              if (a.year !== b.year) return b.year - a.year;
              return b.month - a.month;
            })[0];

            if (latestInvoice && latestInvoice.utilityReading) {
              const previousServicesIds = (latestInvoice.serviceFees || [])
                .map((fee) => {
                  const option = serviceOptions.find(
                    (opt) => opt.name === fee.name,
                  );
                  return option ? option.id : null;
                })
                .filter(Boolean);

              setFormData((prev) => ({
                ...prev,
                oldElectric:
                  latestInvoice.utilityReading.newElectric || prev.oldElectric,
                newElectric:
                  latestInvoice.utilityReading.newElectric || prev.newElectric,
                electricPrice:
                  latestInvoice.utilityReading.electricPrice ||
                  prev.electricPrice,
                oldWater:
                  latestInvoice.utilityReading.newWater || prev.oldWater,
                newWater:
                  latestInvoice.utilityReading.newWater || prev.newWater,
                waterPrice:
                  latestInvoice.utilityReading.waterPrice || prev.waterPrice,
                selectedServices:
                  previousServicesIds.length > 0
                    ? previousServicesIds
                    : prev.selectedServices,
              }));
            }
          }
        })
        .catch((err) => console.error("Lỗi lấy hóa đơn cũ", err));
    }
  }, [formData.roomId, serviceOptions]);

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

  const handleServiceQuantityChange = (serviceId, quantity) => {
    setFormData((prev) => ({
      ...prev,
      serviceQuantities: {
        ...prev.serviceQuantities,
        [serviceId]: quantity,
      },
    }));
    clearFieldErrors("serviceQuantities");
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

      setTimeout(() => {
        navigate("/invoices");
      }, 1500);
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
    handleServiceQuantityChange,
    handleSubmit,

    getInputClass,
    getSelectClass,
  };
};
