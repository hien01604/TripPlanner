import { useDispatch, useSelector } from "react-redux";
import { updateTripBudget, addBudgetItem, updateBudgetItem, deleteBudgetItem } from '../data/tripSlice'
import '../style/Budget.css';
import { useState } from 'react';
import { getBudgetSummary } from '../services/budgetService'

// Icons
import { IoMdAdd } from "react-icons/io";
import { FiChevronRight } from "react-icons/fi";

// Components
import BudgetCategoryChartData  from '../components/BudgetCategoryChartData'
import LastModifiedLine from '../components/LastModifiedLine'
import BudgetTable from '../components/BudgetTable'
import AddDialog from '../components/AddDialog'

const LAST_MODIFIED_KEY = "tripplanner-budget-last-modified";

const CATEGORIES = [
    {_id: 1, name:'Transport'}, 
    {_id: 2, name: 'Accommodation'}, 
    {_id: 3, name:'Food',}, 
    {_id: 4, name: 'Shopping'}, 
    {_id: 5, name: 'Activity'}, 
    {_id: 6, name: 'Other'}
]


export default function Budget({ selectedTripIndex = 0 }) {
    const [lastModified, setLastModified] = useState(() => {
        return localStorage.getItem(LAST_MODIFIED_KEY) || new Date().toISOString();
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [isEditBudgetDialogOpen, setIsEditBudgetDialogOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        estimatedCost: '',
        actualCost: '',
        paymentStatus: ''
    });

    const [editBudgetData, setEditBudgetData] = useState('');

    const dispatch = useDispatch();

    const updateLastModified = () => {
      const now = new Date().toISOString();

      setLastModified(now);
      localStorage.setItem(LAST_MODIFIED_KEY, now);
    };

    const trips = useSelector(state => state.trip.trips ?? [])
    const trip = trips[selectedTripIndex] || {};

    const budgetItems = trip?.budgetItems ?? []
    const totalBudget = Number(trip?.budget) || 0;

    const summary = getBudgetSummary({ budgetItems, totalBudget })
    
    function handleAddClick() {
        setIsDialogOpen(true);
    };

    function handleEditBudgetClick() {
      setEditBudgetData(trip.budget ?? '');
      setIsEditBudgetDialogOpen(true)
    }

    function handleEditBudgetChange(e) {
      setEditBudgetData(e.target.value)
    }
    function handleSaveEditBudget() {
      dispatch(updateTripBudget({
        tripIndex: selectedTripIndex,
        newBudget: Number(editBudgetData)
      }))
      setIsEditBudgetDialogOpen(false);
      updateLastModified();
    }
    // Create new expense
    
    return (
        <>
        <div className='budget-page'>
            <header className='budget-header' id='header' >
                <div className="itinerary-topbar">
                  <div className="breadcrumb">
                    <span>{trip.tripName}</span>
                    <FiChevronRight />
                    <strong>Budget</strong>
                  </div>
          
                  <LastModifiedLine lastModified={lastModified}/>
                </div>
                <div className='budget-header-content'>
                  <div className='budget-title'>
                      <h2 className='budget-title'>Budget</h2>
                      <p className='trip-budget'>Trip budget: <span>{totalBudget? totalBudget.toLocaleString() : 'Not set'}</span></p>
                  </div>
                  <div className='action-sheet'>
                      <div className='button-group'>
                          {/* Add new budget item */}
                          <button className='primary-btn' onClick={handleAddClick}>
                              Add Expense
                              <IoMdAdd />
                          </button>
                          <button className='secondary-btn' onClick={handleEditBudgetClick}>
                              Edit Budget
                          </button>
                      </div>
                  </div>
                </div>

                {isDialogOpen && (
                    <AddDialog 
                      formData={formData}
                      categories={CATEGORIES}
                      onChange={(e) => {
                        const { name, value } = e.target;
                        setFormData(prev => ({
                            ...prev,
                            [name]: value,
                        }))
                      }}
                      onSubmit={(e) => {
                          e.preventDefault();

                          const nextId =
                            budgetItems.length > 0
                              ? Math.max(...budgetItems.map(item => item.id)) + 1
                              : 1;
                          
                          const newItem = {
                              id: nextId,
                              name: formData.name,
                              category: formData.category,
                              estimatedCost: Number(formData.estimatedCost),
                              actualCost: Number(formData.actualCost),
                              paymentStatus: formData.paymentStatus
                          }

                          dispatch(addBudgetItem({
                            tripIndex: selectedTripIndex,
                            newItem
                          }))
                          setFormData({
                              name: '',
                              category: '',
                              estimatedCost: '',
                              actualCost: '',
                              paymentStatus: '',
                          });

                          setIsDialogOpen(false)
                          updateLastModified();
                      }}
                      onCancel={() => setIsDialogOpen(false)}
                    />
                )}

                {isEditBudgetDialogOpen && 
                  <div className='modal-overlay'>
                    <div className='edit-budget-dialog'>
                      <div className='budget-form'>
                        <h3>Edit trip budget</h3>

                        <label htmlFor='trip-budget'>Trip budget</label>
                        <input 
                            id='trip-budget'
                            name='trip-budget'
                            type='number'
                            value={editBudgetData}
                            onChange={handleEditBudgetChange}
                        />
                        <div className='form-actions'>
                          <button className='primary-btn' onClick={handleSaveEditBudget}>Save</button>
                          <button type='button' onClick={() => setIsEditBudgetDialogOpen(false)}>Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>
                }
 
            </header>
            <main className='budget-content'>
                <div className='budget-items'>
                    <div className='section-title'>
                      <h2>Expenses</h2>
                    </div>
                    <BudgetTable 
                      items={summary.budgetItems} 
                      categories={CATEGORIES}
                      onSaveRow={(id, draft) => {
                        dispatch(updateBudgetItem({
                          tripIndex: selectedTripIndex,
                          itemId: id,
                          changes: {
                            ...draft,
                            estimatedCost: Number(draft.estimatedCost),
                            actualCost: Number(draft.actualCost),
                          }
                        }));

                        updateLastModified();
                      }}
                      onDeleteRow={(id) => {
                        dispatch(deleteBudgetItem({
                          tripIndex: selectedTripIndex,
                          itemId: id,
                        }));
                        updateLastModified();
                      }}
                      
                    />
                </div>

                <div className='budget-summary'>
                    <div className='summary-section'>
                      <div className='section-title'>
                          <h2>Summary</h2>
                      </div>
                      <div className={`alert-section`}>
                          {/* If reached 80%, throw warning message, red color */}
                          <div><strong className={`remaining-percent ${summary.usedPercent >= 80 ? 'remaining-percent-warning' : ''}`}>{`${100 - summary.usedPercent}%`}</strong> remaining</div>
                          <div className='total-loader'>
                            <div className={`used-loader ${summary.usedPercent >= 80 ? 'used-loader-warning' : ''}`} style={{width: `${summary.usedPercent}%`}}></div>
                          </div>
                          {summary.usedPercent >= 80 && 
                            <div className={`inner-card ${summary.usedPercent >= 80 ? 'inner-card-warning' : ''}`}>
                              <div className='message-warning'>You have used up <strong>{summary.usedPercent}%</strong> of your budget <strong className='link-to-action' onClick={handleEditBudgetClick}>Edit budget</strong></div>
                            </div>
                          }
                      </div>
                      <dl className='summary-list'>
                          <div className='summary-row'>
                              <dt>Total</dt>
                              <dd>{totalBudget.toLocaleString()}</dd>
                          </div>
                          <div className='summary-row'>
                              <dt>Used</dt>
                              <dd>{summary.usedBudget.toLocaleString()}</dd>
                          </div>
                          <div className='summary-row'>
                              <dt>Remaining</dt>
                              <dd className={`remaining-value ${summary.usedPercent >= 80 ? 'remaining-value-warning' : ''}`}>{summary.remainingBudget.toLocaleString()}</dd>
                          </div>
                      </dl>
                    </div>
                    <div className='summary-section'>
                      <div className='section-title'>
                          <h2>Categories</h2>
                      </div>
                      {Object.keys(summary.spendingPerCategory).length > 0 
                          && <div className='inner-card'>
                            <p>
                              You spent on {' '}
                              <strong>
                                {
                                  Object.entries(summary.spendingPerCategory).reduce((max, current) =>
                                    current[1] > max[1] ? current : max
                                  )[0]

                                }
                              </strong>
                              {' '} the most in this trip
                            </p>
                          </div>
                      }
                      <div className='chart-shell'>
                        <div className='chart-box'>
                          <BudgetCategoryChartData categories={ CATEGORIES } data={ summary.spendingPerCategory } />
                        </div>
                      </div>
                    </div>
                </div>
            </main>
        </div>
        </>
    )
}

