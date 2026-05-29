export const calculateElectricCost = (
  oldElectric,
  newElectric,
  electricPrice,
) => {
  const usedElectric = Math.max(Number(newElectric) - Number(oldElectric), 0);

  return usedElectric * Number(electricPrice || 0);
};

export const calculateWaterCost = (oldWater, newWater, waterPrice) => {
  const usedWater = Math.max(Number(newWater) - Number(oldWater), 0);

  return usedWater * Number(waterPrice || 0);
};

export const calculateServiceCost = (services = [], quantities = {}) => {
  return services.reduce((total, service) => {
    const quantity = quantities[service.id] || 1;
    return total + Number(service.price || 0) * Number(quantity);
  }, 0);
};

export const calculateInvoiceTotal = (
  roomPrice = 0,
  electricCost = 0,
  waterCost = 0,
  serviceCost = 0,
) => {
  return (
    Number(roomPrice || 0) +
    Number(electricCost || 0) +
    Number(waterCost || 0) +
    Number(serviceCost || 0)
  );
};
