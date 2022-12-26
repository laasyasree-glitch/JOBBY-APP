import './index.css'

const FiltersGroup = props => {
  const renderRatingsFiltersList = () => {
    const {salaryRangesList} = props

    return salaryRangesList.map(salary => {
      const {updateOnClick} = props
      const onClickSalaryItem = () => updateOnClick(salary.salaryRangeId)

      return (
        <li onClick={onClickSalaryItem}>
          <label htmlFor={salary.salaryRangeId}>{salary.label}</label>
          <input type="radio" id={salary.salaryRangeId} name="group" />
        </li>
      )
    })
  }

  const renderRatingsFilters = () => (
    <div>
      <h1 className="rating-heading">Salary Range</h1>
      <ul className="ratings-list">{renderRatingsFiltersList()}</ul>
    </div>
  )

  const renderCategoriesList = () => {
    const {employmentTypesList} = props

    return employmentTypesList.map(job => {
      const {updateOnChecked} = props
      const onClickEmployeementItem = event =>
        updateOnChecked(job.employmentTypeId, event.target.checked)
      return (
        <li onClick={onClickEmployeementItem}>
          <label htmlFor={job.employmentTypeId}>{job.label}</label>
          <input type="checkbox" id={job.employmentTypeId} />
        </li>
      )
    })
  }

  const renderProductCategories = () => (
    <>
      <h1 className="category-heading">Type of Employment</h1>
      <ul className="categories-list">{renderCategoriesList()}</ul>
    </>
  )

  const {clearFilters} = props

  return (
    <div className="filters-group-container">
      {renderProductCategories()}
      {renderRatingsFilters()}
      <button
        type="button"
        className="clear-filters-btn"
        onClick={clearFilters}
      >
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
