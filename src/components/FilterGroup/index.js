import {BsSearch} from 'react-icons/bs'

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
      const onClickEmployeementItem = () =>
        updateOnChecked(job.employmentTypeId)
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

  const onEnterSearchInput = event => {
    const {enterSearchInput} = props
    if (event.key === 'Enter') {
      enterSearchInput()
    }
  }

  const onChangeSearchInput = event => {
    const {changeSearchInput} = props
    changeSearchInput(event.target.value)
  }

  const renderSearchInput = () => {
    const {searchInput} = props
    return (
      <div className="search-input-container">
        <input
          value={searchInput}
          type="search"
          className="search-input"
          placeholder="Search"
          onChange={onChangeSearchInput}
          onKeyDown={onEnterSearchInput}
        />
        <button type="button" testid="searchButton">
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  const {clearFilters} = props

  return (
    <div className="filters-group-container">
      {renderSearchInput()}
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
