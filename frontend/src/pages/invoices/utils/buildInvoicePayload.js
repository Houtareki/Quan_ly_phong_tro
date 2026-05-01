export const buildInvoicePayload = (
  formData,
  selectedRoom,
  selectedServiceFees,
) => {
  return {
    contractId: selectedRoom.contractId,
    roomId: selectedRoom.id,
    tenantId: selectedRoom.tenantId,

    month: Number(formData.month),
    year: Number(formData.year),
    roomPrice: selectedRoom?.roomPrice || 0,

    utilityReading: {
      oldElectric: Number(formData.oldElectric),
      newElectric: Number(formData.newElectric),
      electricPrice: Number(formData.electricPrice),
      oldWater: Number(formData.oldWater),
      newWater: Number(formData.newWater),
      waterPrice: Number(formData.waterPrice),
    },

    serviceFees: selectedServiceFees.map((service) => ({
      name: service.name,
      price: service.price,
      quantity: 1,
    })),
  };
};
