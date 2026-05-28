import { useMemo } from "react";
import {
  calculateElectricCost,
  calculateInvoiceTotal,
  calculateServiceCost,
  calculateWaterCost,
} from "../utils/invoiceCalculation";

export const useInvoiceCalculator = (formData, roomOptions, serviceOptions) => {
  const selectedRoom = useMemo(() => {
    return roomOptions.find((room) => room.id === formData.roomId);
  }, [formData.roomId, roomOptions]);

  const selectedServiceFees = useMemo(() => {
    return serviceOptions
      .filter((service) => formData.selectedServices.includes(service.id))
      .map((service) => ({
        ...service,
        quantity: formData.serviceQuantities?.[service.id] || 1,
      }));
  }, [formData.selectedServices, formData.serviceQuantities, serviceOptions]);

  const electricCost = useMemo(() => {
    return calculateElectricCost(
      formData.oldElectric,
      formData.newElectric,
      formData.electricPrice,
    );
  }, [formData.oldElectric, formData.newElectric, formData.electricPrice]);

  const waterCost = useMemo(() => {
    return calculateWaterCost(
      formData.newWater,
      formData.oldWater,
      formData.waterPrice,
    );
  }, [formData.newWater, formData.oldWater, formData.waterPrice]);

  const serviceCost = useMemo(() => {
    return calculateServiceCost(
      selectedServiceFees,
      formData.serviceQuantities,
    );
  }, [selectedServiceFees, formData.serviceQuantities]);

  const totalCost = useMemo(() => {
    return calculateInvoiceTotal(
      selectedRoom?.roomPrice || 0,
      electricCost,
      waterCost,
      serviceCost,
    );
  }, [selectedRoom, electricCost, waterCost, serviceCost]);

  return {
    selectedRoom,
    selectedServiceFees,
    electricCost,
    waterCost,
    serviceCost,
    totalCost,
  };
};
