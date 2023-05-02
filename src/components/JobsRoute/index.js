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

const profileApiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
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
    profileDetails: [],
    apiStatus: apiStatusConstants.initial,
    profileApiStatus: apiStatusConstants.initial,
    salaryRangeId: '',
    activeJobId: [],
    search: '',
  }

  componentDidMount() {
    this.getJobsList()
    this.getProfileView()
  }

  renderProfile = () => {
    const {profileApiStatus} = this.state

    switch (profileApiStatus) {
      case profileApiStatusConstants.success:
        return this.renderProfileView()
      case profileApiStatusConstants.failure:
        return this.renderProfileFailureView()
      case profileApiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
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

  onClickRetryProfileButton = () => {
    this.getProfileView()
  }

  renderSearchFailure = () => (
    <div>
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

  getFormattedData = data => ({
    profileDetails: data.profile_details,
  })

  getFormattedProfileData = data => ({
    name: data.name,
    profileImageUrl: data.profile_image_url,
    shortBio: data.short_bio,
  })

  getProfileView = async () => {
    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response2 = await fetch(profileApiUrl, options)
    if (response2.ok === true) {
      const data2 = await response2.json()
      const updatedData22 = this.getFormattedData(data2)
      const updatedData2 = this.getFormattedProfileData(
        updatedData22.profileDetails,
      )
      this.setState({
        profileDetails: updatedData2,
        profileApiStatus: profileApiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  getJobsList = async () => {
    const {activeJobId, salaryRangeId, search} = this.state
    const jwtToken = Cookies.get('jwt_token')

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const x = Array.isArray(activeJobId) ? activeJobId.join(',') : ''
    console.log(x)
    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${x}&minimum_package=${salaryRangeId}&search=${search}`
    console.log(jobsApiUrl)
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

  renderProfileFailureView = () => (
    <button
      type="button"
      className="button"
      onClick={this.onClickRetryProfileButton}
    >
      Retry
    </button>
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

  renderProfileView = () => {
    const {profileDetails} = this.state
    const {profileImageUrl, name, shortBio} = profileDetails
    return (
      <div className="profile-container">
        <img
          src={profileImageUrl}
          alt="profile_image"
          className="profile-image"
        />
        <h1 className="heading">{name}</h1>
        <p className="para">{shortBio}</p>
        <hr />
      </div>
    )
  }

  renderLoadingView = () => (
    // <div className="loader-container" testid="loader">
    <div>
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
        profileDetails: [],
        apiStatus: apiStatusConstants.initial,
        profileApiStatus: apiStatusConstants.initial,
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
      <div className="bg-main">
        <Header />
        <div className="alignment-container">
          <div className="filter-section">
            {this.renderProfile()}
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
    )
  }
}

export default JobsRoute
