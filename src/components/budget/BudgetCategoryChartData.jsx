import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function BudgetCategoryChartData({ categories = [], data = {} }) {
    // Prepare data for donut chart
    const chartCategories = categories.filter(c => data[c.name] != null);
    
    const donutData = {
        labels: chartCategories.map((category) => category.name),
        datasets: [{
            label: 'Spending per category',
            data: chartCategories.map((category) => data[category.name] ?? 0),
            backgroundColor: [
                '#4fd1c5',
                '#3b82f6',
                '#10b981',
                '#f59e0b',
                '#8B5CF6',
                '#424242',
            ],
            hoverOffset: 4
        }]
    };

    const options = {
        cutout: '70%',
        responsive: true,
        maintainAspectRatio: true,
    }
    return (
        <Doughnut data={donutData} options={options}/>
    )
}

export default BudgetCategoryChartData