import {Component} from 'react'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import FilterGroup from '../FilterGroup'
import Header from '../Header'
import CardDetails from '../CardDetails'
import SearchTab from '../SearchTab'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  searchFailure: 'SEARCH_FAILURE',
  inProgress: 'IN_PROGRESS',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class JobsRoute extends Component {
  state = {
    jobsList: [],
    apiStatus: apiStatusConstants.initial,
    salaryRangeId: '',
    activeJobId: [],
    search: '',
  }

  componentDidMount() {
    this.getJobsList()
  }

  renderAllJobs = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.searchFailure:
        return this.renderSearchFailure()
      default:
        return null
    }
  }

  onClickRetryJobsButton = () => {
    this.getJobsList()
  }

  renderSearchFailure = () => (
    <div className="search-failure-view ">
      <img
        alt="no jobs"
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
      />
      <h1>No Jobs Found</h1>
      <p>We could not find any jobs. Try other filters</p>
      <button
        type="button"
        className="button"
        onClick={this.onClickRetryJobsButton}
      >
        Retry
      </button>
    </div>
  )

  getJobsList = async () => {
    const {activeJobId, salaryRangeId, search} = this.state
    const jwtToken = Cookies.get('jwt_token')

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const x = Array.isArray(activeJobId) ? activeJobId.join(',') : ''
    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${x}&minimum_package=${salaryRangeId}&search=${search}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(jobsApiUrl, options)
    let flag = 0
    let data1 = []
    if (response.ok === true) {
      const data = await response.json()
      data1 = data
      if (data.total === 0) {
        flag = 1
        this.setState({
          apiStatus: apiStatusConstants.searchFailure,
        })
      }
    }
    if (flag === 0) {
      const updatedData = data1.jobs.map(job => ({
        title: job.title,
        id: job.id,
        imageUrl: job.company_logo_url,
        rating: job.rating,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        employmentType: job.employment_type,
        description: job.job_description,
      }))

      this.setState({
        jobsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.ok === false) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderFailureView = () => (
    <div>
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png "
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button
        type="button"
        className="button"
        onClick={this.onClickRetryJobsButton}
      >
        Retry
      </button>
    </div>
  )

  updateOnClick = id => {
    this.setState({salaryRangeId: id}, this.getJobsList)
  }

  changeSearchInput = value => {
    this.setState({search: value})
  }

  enterSearchInput = () => {
    this.getJobsList()
  }

  renderJobsListView = () => {
    const {jobsList} = this.state

    return (
      <div className="JobsList">
        <ul>
          {jobsList.map(item => (
            <CardDetails key={item.id} itemDetails={item} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />{' '}
    </div>
  )

  updateOnChecked = (id, isChecked) => {
    const {activeJobId} = this.state
    if (activeJobId === []) {
      this.setState({activeJobId: []}, this.getJobsList)
    }
    if (isChecked) {
      this.setState(
        prevState => ({activeJobId: [...prevState.activeJobId, id]}),
        this.getJobsList,
      )
    } else {
      this.setState(
        prevState => ({
          activeJobId: prevState.activeJobId.filter(x => x !== id),
        }),
        this.getJobsList,
      )
    }
  }

  clearFilters = () => {
    this.setState(
      {
        jobsList: [],
        apiStatus: apiStatusConstants.initial,
        salaryRangeId: '',
        activeJobId: [],
        search: '',
      },
      this.getJobsList,
    )
  }

  render() {
    const {search, salaryRangeId, activeJobId} = this.state

    return (
      <div>
        <Header />
        <div className="bg-main">
          <div className="alignment-container">
            <div className="filter-section">
              <SearchTab
                searchInput={search}
                changeSearchInput={this.changeSearchInput}
                enterSearchInput={this.enterSearchInput}
                className="search"
              />
              <FilterGroup
                employmentTypesList={employmentTypesList}
                salaryRangesList={salaryRangesList}
                activeJobId={activeJobId}
                activeSalaryRangeId={salaryRangeId}
                updateOnChecked={this.updateOnChecked}
                updateOnClick={this.updateOnClick}
                clearFilters={this.clearFilters}
              />
            </div>

            {this.renderAllJobs()}
          </div>
        </div>
      </div>
    )
  }
}

export default JobsRoute
