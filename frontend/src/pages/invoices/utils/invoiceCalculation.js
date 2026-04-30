export const calculateElectricCost = (
  oldElectric,
  newElectric,
  electricPrice,
) => {
  return (
    Math.max(0, Number(newElectric) - Number(oldElectric)) *
    Number(electricPrice || 0)
  );
};

export const calculateWaterCost = (oldWater, newWater, waterPrice) => {
  return (
    Math.max(0, Number(newWater) - Number(oldWater)) * Number(waterPrice || 0)
  );
};

export const serviceCost = (services = []) => {
  return services.reduce(
    (total, service) => total + Number(service.price || 0),
    0,
  );
};

export const totalCost = (
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
