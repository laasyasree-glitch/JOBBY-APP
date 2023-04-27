import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {MdLocationOn} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'
import {BiLinkExternal} from 'react-icons/bi'
import Header from '../Header'
import SimilarJobsSection from '../SimilarJobsSection'
import './index.css'

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
      <p>we cannot seem to find the page you are looking for</p>
      <button type="button" className="button" onClick={this.RetryButton}>
        Retry
      </button>
    </div>
  )

  renderJobsDetailsView = () => {
    const {jobDetails, similarJobs} = this.state
    const {
      companyLogoUrl,
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
      <>
        <div className="job-item-container">
          <div className="first-part-container">
            <div className="img-title-container">
              <img
                className="company-logo"
                src={companyLogoUrl}
                alt="job details company logo"
              />
              <div className="title-rating-container">
                <h1 className="title-heading">{title}</h1>
                <div className="star-rating-container">
                  <AiFillStar className="star-icon" />
                  <p className="rating-text">{rating}</p>
                </div>
              </div>
            </div>
            <div className="location-package-container">
              <div className="location-job-type-container">
                <div className="location-icon-location-container">
                  <MdLocationOn className="location-icon" />
                  <p className="location">{location}</p>
                </div>
                <div className="employment-type-icon-employment-type-container">
                  <p className="job-type">{employmentType}</p>
                </div>
              </div>
              <div className="package-container">
                <p className="package">{packagePerAnnum}</p>
              </div>
            </div>
          </div>
          <hr className="item-hr-line" />
          <div className="second-part-container">
            <div className="description-visit-container">
              <h1 className="description-job-heading">Description</h1>
              <a className="visit-anchor" href={companyWebsiteUrl}>
                Visit <BiLinkExternal />
              </a>
            </div>
            <p className="description-para">{jobDescription}</p>
          </div>
          <h1>Skills</h1>
          <ul className="ul-job-details-container">
            {skills.map(eachItem => (
              <li className="li-job-details-container" key={eachItem.name}>
                <img
                  className="skill-img"
                  src={eachItem.imageUrl}
                  alt={eachItem.name}
                />
                <p>{eachItem.name}</p>
              </li>
            ))}
          </ul>
          <div className="company-life-img-container">
            <div className="life-heading-para-container">
              <h1>Life at Company</h1>
              <p>{lifeAtCompany.description}</p>
            </div>
            <img src={lifeAtCompany.imageUrl} alt="life at company" />
          </div>
        </div>
        <h1 className="similar-jobs-heading">Similar Jobs</h1>
        <ul className="similar-jobs-ul-container">
          {similarJobs.map(eachItem => (
            <SimilarJobsSection
              key={eachItem.id}
              similarJobData={eachItem}
              employmentType={employmentType}
            />
          ))}
        </ul>
      </>
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
      <div className="bg">
        <Header />
        <div>{this.renderJobDetails()}</div>
      </div>
    )
  }
}

export default JobItemDetailsRoute
