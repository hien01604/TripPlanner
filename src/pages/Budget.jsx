import '../style/Budget.css';
import { useState, useEffect } from 'react';
import { getNumericCost, budgetSummary } from '../services/budgetService'

// import CssBaseline from '@mui/material/CssBaseline'
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const CATEGORIES = [
    {_id: 1, name:'Transport'}, 
    {_id: 2, name: 'Accommodation'}, 
    {_id: 3, name:'Food',}, 
    {_id: 4, name: 'Shopping'}, 
    {_id: 5, name: 'Activity'}, 
    {_id: 6, name: 'Other'}
]

const FILTER_CATEGORIES = [
  { _id: 'all', name: 'All' },
  ...CATEGORIES
];

export default function Budget() {
    const [items, setItems] = useState(() => {
        // Load items from local storage
        try {
            const saved = localStorage.getItem('budgetItems');
            return saved ? JSON.parse(saved) : []
        } catch(error) {
            console.error('Invalid local storage', error);
            return [];
        }
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        category: CATEGORIES[0].name,
        estimatedCost: '',
        actualCost: '',
        payment: ''
    });

    const [error, setError] = useState('')

    // const [summary, setSummary] = useState({
    //     estimatedTotal: 0,
    //     actualTotal: 0,
    //     totalDifference: 0,
    //     spendingPerCategory: {},
    //     items: [],
    // })

    const [activeCategory, setActiveCategory] = useState('All')
    const [page, setPage] = useState(1);

    const [rowsPerPage] = useState(10);

    const [draft, setDraft] = useState({
        name: '',
        category: CATEGORIES[0].name,
        estimatedCost: '',
        actualCost: '',
        payment: ''
    })
    const [editRowId, setEditRowId] = useState(null);

    const summary = budgetSummary(items)

    const filtered = summary.items.filter((item) => {
        return activeCategory === 'All' || item.category === activeCategory
    })

    // Calculate fields
    const totalPages = Math.max(1, Math.ceil(filtered.length/rowsPerPage))
    const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage)

    // Save to local storage
    useEffect(() => {
        localStorage.setItem('budgetItems', JSON.stringify(items))
    }, [items]);
    
    function handleAddClick() {
        setIsDialogOpen(true);
    };

    // Create new expense
    
    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    function handleSubmit(e) {
        e.preventDefault();
        const newItem = {
            id: Date.now(),
            name: formData.name,
            category: formData.category,
            estimatedCost: Number(formData.estimatedCost),
            actualCost: Number(formData.actualCost),
            payment: formData.payment
        }

        setItems((prev) => [...prev, newItem])
        setFormData({
            name: '',
            category: CATEGORIES[0].name,
            estimatedCost: '',
            actualCost: '',
            payment: '',
        });

        setIsDialogOpen(false)
    }
    // Edit an expense
    function handleEdit(row) {
        setEditRowId(row.id);
        setDraft({
            name: row.name,
            category: row.category,
            estimatedCost: row.estimatedCost,
            actualCost: row.actualCost,
            payment: row.payment,
        })
    }
    
    function handleSave(id) {
        const updatedItems = items.map((item) => (
            (item.id === id ? {
                ...item,
                ...draft,
                estimatedCost: Number(draft.estimatedCost),
                actualCost: Number(draft.actualCost),
            } : item)
        ))
        console.log("updatedItems:", updatedItems);
        setItems(updatedItems);
        setEditRowId(null);

    }

    // Mark as paid


    // Remove an expense
    function handleDelete(id) {
        setItems(prev => prev.filter(item => item.id !== id))
    }


    // Prepare data for donut chart
    const chartCategories = CATEGORIES.filter(c => summary.spendingPerCategory[c.name] != null);

    const donutData = {
        labels: CATEGORIES.map((category) => category.name),
        datasets: [{
            label: 'Spending per category',
            data: chartCategories.map((category) => summary.spendingPerCategory[category.name] ?? 0),
            backgroundColor: [
                '#EFF187',
                'rgb(54,162,235)',
                // #40D5EC
                '#9B4862',
                '#6BAE73',
                '#6BCAC9',
            ],
            hoverOffset: 4
        }]
    };


    return (
        <>
        <div className='budget-page'>
            <header className='budget-header' id='header' >
                <div className='budget-title'>
                    <h2 className='budget-title'>Budget</h2>
                    <p className='trip-budget'>Trip budget: <span>value from trip</span></p>
                </div>
                <div className='action-sheet'>
                    <div className='button-group'>
                        {/* Add new budget item */}
                        <button className='primary-btn' onClick={handleAddClick}>
                            Add Expense
                            <AddIcon />
                        </button>
                        
                    </div>
                </div>
                {isDialogOpen && (
                    <div className='modal-overlay'>
                        <div className='add-budget-dialog'>
                            <form className='budget-form' onSubmit={handleSubmit}>
                                <h3>Create a new budget entry</h3>

                                <label htmlFor='name'>Item name</label>
                                <input 
                                    id='name'
                                    name='name'
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder='What do you need to buy?'
                                />

                                <label htmlFor='category'>Category</label>
                                <select
                                    value={formData.category}
                                    onChange={handleChange}
                                    name='category'
                                >
                                    <option value=''>Select category</option>
                                    {CATEGORIES.map((category) => (
                                        <option key={category._id} value={category.name}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                
                                <label htmlFor='estimatedCost'>Estimated cost</label>
                                <input
                                    id='estimatedCost'
                                    name='estimatedCost'
                                    type='number'
                                    value={formData.estimatedCost}
                                    onChange={handleChange}
                                />

                                <label htmlFor='actualCost'>Actual cost</label>
                                <input
                                    id='actualCost'
                                    name='actualCost'
                                    type='number'
                                    value={formData.actualCost}
                                    onChange={handleChange}
                                />

                                <label htmlFor='payment'>Payment</label>
                                <select
                                    name='payment'
                                    value={formData.payment}
                                    onChange={handleChange}
                                >
                                    <option value=''>Select status</option>
                                    <option value='Unpaid'>Unpaid</option>
                                    <option value='Paid'>Paid</option>
                                </select>
                                <div className='form-actions'>
                                    <button type='submit'>Submit</button>
                                    <button type='button' onClick={() => setIsDialogOpen(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
 
            </header>
            {error && <div>
                <h3 className='error-title'>Error</h3>
                {error && <p>{error}</p>}
            </div>}
            <main className='budget-content'>
                <div className='budget-items'>
                    <div className='section-title'>Expenses</div>
                    <div className='category-tabs-filter'>
                        <div className='category-tabs'>
                            {FILTER_CATEGORIES.map((category) => (
                                <button 
                                    key={category._id} 
                                    onClick={() => { setActiveCategory(category.name); setPage(1); }} 
                                    className={`tab-item ${activeCategory === category.name ? "tab-item--active" : ""}`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className='table-wrap'>
                        <table className='budget-table'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Item</th>
                                    <th>Category</th>
                                    <th>Estimated cost</th>
                                    <th>Actual cost</th>
                                    <th>Payment</th>
                                    <th>Difference</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.length === 0 ? (
                                    <tr><td className='empty-cell'>No expenses found</td></tr>
                                ): paginated.map((item, index) => (
                                    <tr key={item.id} >
                                        <td>{index + 1}</td>
                                        <td>{editRowId === item.id ? <input value={draft.name} onChange={(e) => setDraft({...draft, name: e.target.value})} defaultValue={item.name}/> : item.name}</td>
                                        <td>{editRowId === item.id ? <select value={draft.category} onChange={(e) => setDraft({...draft, category: e.target.value})} defaultValue={item.category}>Select category</select> : item.category}</td>
                                        <td>{editRowId === item.id ? <input value={draft.estimatedCost} onChange={(e) => setDraft({...draft, estimatedCost: e.target.value})} defaultValue={item.estimatedCost}/> : item.estimatedCost}</td>
                                        <td>{editRowId === item.id ? <input value={draft.actualCost} onChange={(e) => setDraft({...draft, actualCost: e.target.value})} defaultValue={item.actualCost}/> : item.actualCost}</td>
                                        <td>{editRowId === item.id ? 
                                            <select
                                                name='payment'
                                                value={draft.payment}
                                                onChange={(e) => setDraft({...draft, payment: e.target.value})} 
                                            >
                                                <option value=''>Select status</option>
                                                <option value='Unpaid'>Unpaid</option>
                                                <option value='Paid'>Paid</option>
                                            </select> 
                                            : item.payment}</td>
                                        <td>{(getNumericCost(draft.actualCost) && getNumericCost(draft.estimatedCost)) ? (draft.actualCost - draft.estimatedCost) : item.difference}</td>
                                        <td>
                                            {editRowId === item.id ?
                                            <>
                                                <button className='primary-btn' onClick={() => handleSave(item.id)}>
                                                    Save
                                                </button>
                                                <button className='tertiary-btn' onClick={() => setEditRowId(null)}>
                                                    Cancel
                                                </button>
                                            </>
                                            :
                                            <IconButton 
                                                aria-label='edit' 
                                                onClick={() => handleEdit(item)}
                                            >
                                                <EditIcon />
                                            </IconButton>}
                                        </td>
                                        <td>
                                            <IconButton aria-label='delete' onClick={() => handleDelete(item.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                
                    <div className='pagination'>
                        <select className='page-number'>
                            <option>10</option><option>25</option><option>50</option>
                        </select>
                        <div className='page-mover'>
                            {[
                                { icon: "«", action: () => setPage(1) },
                                { icon: "‹", action: () => setPage(p => Math.max(1, p - 1)) },
                            ].map((btn, i) => (
                                <button key={i} onClick={btn.action} style={{ width: 28, height: 28, border: "1px solid #ddd", borderRadius: 6, background: "#fff", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>{btn.icon}</button>
                            ))}
                            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#555" }}>
                                Page
                                <select value={page} onChange={e => setPage(Number(e.target.value))} style={{ border: "1px solid #ddd", borderRadius: 6, padding: "3px 6px", fontSize: 13 }}>
                                {Array.from({ length: totalPages }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                                </select>
                                / {totalPages}
                            </div>
                            {[
                                { icon: "›", action: () => setPage(p => Math.min(totalPages, p + 1)) },
                                { icon: "»", action: () => setPage(totalPages) },
                            ].map((btn, i) => (
                                <button key={i} onClick={btn.action} style={{ width: 28, height: 28, border: "1px solid #ddd", borderRadius: 6, background: "#fff", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>{btn.icon}</button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className='budget-summary'>
                    <div className='budget-title'>
                        <h2>Summary</h2>
                    </div>
                    <dl className='summary-list'>
                        <div className='summary-row'>
                            <dt>Estimated Total</dt>
                            <dd>{summary.estimatedTotal}</dd>
                        </div>
                        <div className='summary-row'>
                            <dt>Actual Total</dt>
                            <dd>{summary.actualTotal}</dd>
                        </div>
                        <div className='summary-row'>
                            <dt>Total difference</dt>
                            <dd>{summary.totalDifference}</dd>
                        </div>
                    </dl>
                    <Doughnut data={donutData} />
                </div>
            </main>
        </div>
        </>
    )
}
