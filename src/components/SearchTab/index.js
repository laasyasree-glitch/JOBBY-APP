import {BsSearch} from 'react-icons/bs'
import './index.css'

const SearchTab = props => {
  const onEnterSearchInput = event => {
    const {enterSearchInput} = props
    if (event.key === 'Enter') {
      enterSearchInput()
    }
  }
  const onClickButton = () => {
    const {enterSearchInput} = props
    enterSearchInput()
  }

  const onChangeSearchInput = event => {
    const {changeSearchInput} = props
    changeSearchInput(event.target.value)
  }

  const renderSearchInput = () => {
    const {searchInput} = props
    return (
      <div>
        <input
          value={searchInput}
          type="search"
          className="search-input"
          placeholder="Search"
          onChange={onChangeSearchInput}
          onKeyDown={onEnterSearchInput}
        />
        {/* <button type="button" testid="searchButton" onClick={onClickButton}> */}
        <button
          type="button"
          onClick={onClickButton}
          className="search-container"
          testid="searchButton"
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  return <div>{renderSearchInput()}</div>
}

export default SearchTab
