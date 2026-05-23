import '../style/Budget.css'
function AddDialog({ formData, categories, onChange, onSubmit, onCancel }) {
    function handleChange(e) {
        onChange(e)
    }
    function handleSubmit(e) {
        onSubmit(e)
    }
    function handleCancel() {
        onCancel()
    }
    return (
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
                        <option value='' selected>Select category</option>
                        {categories.map((category) => (
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

                    <label htmlFor='paymentStatus'>Payment</label>
                    <select
                        name='paymentStatus'
                        value={formData.paymentStatus}
                        onChange={handleChange}
                    >
                        <option value=''>Select status</option>
                        <option value='Unpaid'>Unpaid</option>
                        <option value='Paid'>Paid</option>
                    </select>
                    <div className='form-actions'>
                        <button type='submit'>Submit</button>
                        <button type='button' onClick={handleCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default AddDialog