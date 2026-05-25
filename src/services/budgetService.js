
// Check number type
export function getNumericCost(value) {
    return typeof value === 'number' ? value : 0
}
// Get number of actual cost. If user hasn't paid (null), use 0
function getActualCostValue(value) {
    return value === null ? 0 : value
}

// Create calculating functions
function calculateTotal(items, key) {
    return items.reduce((total, item) => {
        if (key === 'actualCost') return total + getNumericCost(getActualCostValue(item[key]))
        return total + getNumericCost(item[key]);
    }, 0);
}

function calculateDifference(item) {
  const actual = getNumericCost(getActualCostValue(item.actualCost));
  const estimated = getNumericCost(item.estimatedCost);
  return (estimated - actual);
}


// Output budget summary: all calculated budget fields
export const getBudgetSummary = ({budgetItems = [], totalBudget = 0}) => {
    // Add difference to each item data
    const itemsWithDifference = budgetItems.map((item) => (
        {...item, difference: calculateDifference(item)}
    ))

    // Calculate spending per category
    const spendingPerCategory = budgetItems.reduce((acc, item) => {
        const category = item.category || 'Other';
        acc[category] = (acc[category] || 0) + getNumericCost(item.actualCost);
        return acc;
    }, {});

	// const actualCost = budgetItems.map((item) => getActualCostValue(item.actualCost));
	const usedBudget = calculateTotal(budgetItems, 'actualCost')
	
    const remainingBudget = Math.max(0, totalBudget - usedBudget);
    const usedPercent = totalBudget > 0 ? Math.min(100, Math.round((usedBudget / totalBudget) * 100)) : 0;
  
	
	return {
        usedBudget,
        remainingBudget,
        spendingPerCategory,
        usedPercent,
        budgetItems: itemsWithDifference,
	}
}

