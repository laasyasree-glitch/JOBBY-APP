import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import SimilarJobsSection from '../SimilarJobsSection'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetailsRoute extends Component {
  state = {
    jobDetails: {},
    similarJobs: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductData()
  }

  getFormattedData = data => ({
    jobDetails: data.job_details,
    similarJobs: data.similar_jobs,
  })

  getFormattedSkills = data =>
    data.map(x => ({
      imageUrl: x.image_url,
      name: x.name,
    }))

  getFormattedLifeAtCompany = data => ({
    description: data.description,
    imageUrl: data.image_url,
  })

  getFormattedJobDetails = data => ({
    id: data.id,
    companyLogo: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    employmentType: data.employment_type,
    jobDescription: data.job_description,
    location: data.location,
    packagePerAnnum: data.package_per_annum,
    rating: data.rating,
    skills: this.getFormattedSkills(data.skills),
    lifeAtCompany: this.getFormattedLifeAtCompany(data.life_at_company),
  })

  getFormattedSimilarJobDetails = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    location: data.location,
    rating: data.rating,
    title: data.title,
  })

  getProductData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = this.getFormattedData(fetchedData)
      const formattedJobDetails = this.getFormattedJobDetails(
        updatedData.jobDetails,
      )
      const formattedSimilarJobDetails = updatedData.similarJobs.map(
        eachSimilarJob => this.getFormattedSimilarJobDetails(eachSimilarJob),
      )
      console.log(formattedJobDetails)
      this.setState({
        jobDetails: formattedJobDetails,
        similarJobs: formattedSimilarJobDetails,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    // <div className="loader-container" testid="loader">
    <div>
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  RetryButton = () => {
    this.getProductData()
  }

  renderFailureView = () => (
    <div>
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png "
        className="failure-view-image"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" className="button" onClick={this.RetryButton}>
        Retry
      </button>
    </div>
  )

  renderJobsDetailsView = () => {
    const {jobDetails, similarJobs} = this.state
    const {
      companyLogo,
      jobDescription,
      companyWebsiteUrl,
      employmentType,
      location,
      packagePerAnnum,
      rating,
      skills,
      lifeAtCompany,
      title,
    } = jobDetails
    return (
      <div>
        <div>
          <img src={companyLogo} alt="job details company logo" />
          <h1>{title}</h1>
          <h1>Description</h1>
          <p>{jobDescription}</p>
          <p>{employmentType}</p>
          <p>{location}</p>
          <p>{packagePerAnnum}</p>
          <p>{rating}</p>
          <a href={companyWebsiteUrl}>Visit</a>
          <ul>
            <li key="skills">
              <h1>Skills</h1>
              <ul>
                {skills.map(eachSkill => (
                  <li key={eachSkill.name}>
                    <img src={eachSkill.imageUrl} alt={eachSkill.name} />
                    <h1>{eachSkill.name}</h1>
                  </li>
                ))}
              </ul>
            </li>
            <li key="life">
              <h1>Life At Company</h1>
              <p>{lifeAtCompany.description}</p>
              <img src={lifeAtCompany.imageUrl} alt="life at company" />
              <h1>Similar Jobs</h1>
              <div>
                <ul>
                  {similarJobs.map(eachSimilarJob => (
                    <SimilarJobsSection
                      details={eachSimilarJob}
                      key={eachSimilarJob.id}
                    />
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    )
  }

  renderJobDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div>{this.renderJobDetails()}</div>
      </>
    )
  }
}

export default JobItemDetailsRoute
