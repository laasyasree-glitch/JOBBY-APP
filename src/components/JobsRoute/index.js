import {Component} from 'react'
import {Link} from 'react-router-dom'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import FilterGroup from '../FilterGroup'
import Header from '../Header'
import CardDetails from '../CardDetails'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  searchFailure: 'SEARCHFAILURE',
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
    salaryRangeId: '',
    activeJobId: '',
    searchValue: '',
  }

  componentDidMount() {
    this.getJobsList()
  }

  renderAllJobs = () => {
    const {apiStatus} = this.state
    console.log(apiStatus)

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

  renderSearchFailure = () => (
    <div className="product-details-failure-view-container">
      <img
        alt="no jobs"
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
      />
      <h1>No Jobs Found</h1>
      <p>We could not find any jobs. Try other filters</p>
      <Link to="/products">
        <button type="button" className="button">
          Retry
        </button>
      </Link>
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

  getJobsList = async () => {
    const {activeJobId, salaryRangeId, searchValue} = this.state
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${activeJobId.slice(
      0,
      -1,
    )}&minimum_package=${salaryRangeId}&search=${searchValue}`
    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(jobsApiUrl, options)
    const response2 = await fetch(profileApiUrl, options)
    if (response.ok === true && response2.ok === true) {
      const data = await response.json()
      const updatedData = data.jobs.map(job => ({
        title: job.title,
        id: job.id,
        imageUrl: job.company_logo_url,
        rating: job.rating,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        employmentType: job.employment_type,
        description: job.job_description,
      }))
      const data2 = await response2.json()
      const updatedData22 = this.getFormattedData(data2)
      const updatedData2 = this.getFormattedProfileData(
        updatedData22.profileDetails,
      )
      this.setState({
        jobsList: updatedData,
        profileDetails: updatedData2,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.searchFailure,
      })
    }
    if (response.status === 404) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderFailureView = () => (
    <div className="product-details-failure-view-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png "
        className="failure-view-image"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <Link to="/products">
        <button type="button" className="button">
          Retry
        </button>
      </Link>
    </div>
  )

  updateOnClick = id => {
    this.setState({salaryRangeId: id}, this.getJobsList)
  }

  changeSearchInput = value => {
    this.setState({searchValue: value}, this.getJobsList)
  }

  enterSearchInput = () => {
    this.getJobsList()
  }

  renderJobsListView = () => {
    const {jobsList, profileDetails} = this.state
    const {profileImageUrl, name, shortBio} = profileDetails
    return (
      <div>
        <div>
          <img src={profileImageUrl} alt="profile_image" />
          <h1>{name}</h1>
          <p>{shortBio}</p>
          <ul>
            {jobsList.map(item => (
              <CardDetails key={item.id} itemDetails={item} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  updateOnChecked = id => {
    const {activeJobId} = this.state
    if (activeJobId === '') {
      this.setState({activeJobId: ''}, this.getJobsList)
    }
    this.setState(
      prevState => ({activeJobId: `${id},${prevState.activeJobId}`}),
      this.getJobsList,
    )
  }

  clearFilters = () => {
    this.setState(
      {
        salaryRangeId: '',
        activeJobId: '',
        searchValue: '',
      },
      this.getJobsList,
    )
  }

  render() {
    const {searchValue, salaryRangeId, activeJobId} = this.state

    return (
      <div>
        <Header />
        <FilterGroup
          searchInput={searchValue}
          employmentTypesList={employmentTypesList}
          salaryRangesList={salaryRangesList}
          changeSearchInput={this.changeSearchInput}
          enterSearchInput={this.enterSearchInput}
          activeJobId={activeJobId}
          activeSalaryRangeId={salaryRangeId}
          updateOnChecked={this.updateOnChecked}
          updateOnClick={this.updateOnClick}
          clearFilters={this.clearFilters}
        />
        {this.renderAllJobs()}
      </div>
    )
  }
}

export default JobsRoute
