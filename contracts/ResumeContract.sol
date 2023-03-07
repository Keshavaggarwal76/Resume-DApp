// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ResumeContract {
    struct Resume {
        string name;
        string tagline;
        string location;
        string email;
        string[] skills;
        Experiences[] experiences;
        Educations[] educations;
        string aboutMe;
        SocialLinks socialLinks;
    }

    struct Experiences {
        string jobTitle;
        string company;
        string startDate;
        string endDate;
        string description;
    }

    struct Educations {
        string degree;
        string institution;
        string startDate;
        string endDate;
        string description;
    }

    struct SocialLinks {
        string github;
        string linkedin;
        string instagram;
        string twitter;
    }

    mapping(address => Resume) public resumes;

    address public owner;

    // Events
    event NewResumeAdded(address indexed user, string name);
    event NewExperienceAdded(
        address indexed user,
        string jobTitle,
        string company
    );
    event NewEducationAdded(
        address indexed user,
        string degree,
        string institution
    );

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addResume(
        string memory _name,
        string memory _tagline,
        string memory _location,
        string memory _email,
        string[] memory _skills,
        string memory _aboutMe
    ) public {
        Resume storage newResume = resumes[msg.sender];
        newResume.name = _name;
        newResume.tagline = _tagline;
        newResume.location = _location;
        newResume.email = _email;
        newResume.skills = _skills;
        newResume.aboutMe = _aboutMe;
        emit NewResumeAdded(msg.sender, _name);
    }

    function addExperience(
        string memory _jobTitle,
        string memory _company,
        string memory _startDate,
        string memory _endDate,
        string memory _description
    ) public {
        Resume storage myResume = resumes[msg.sender];
        myResume.experiences.push(
            Experiences({
                jobTitle: _jobTitle,
                company: _company,
                startDate: _startDate,
                endDate: _endDate,
                description: _description
            })
        );
        emit NewExperienceAdded(msg.sender, _jobTitle, _company);
    }

    function addEducation(
        string memory _degree,
        string memory _institution,
        string memory _startDate,
        string memory _endDate,
        string memory _description
    ) public {
        Resume storage myResume = resumes[msg.sender];
        myResume.educations.push(
            Educations({
                degree: _degree,
                institution: _institution,
                startDate: _startDate,
                endDate: _endDate,
                description: _description
            })
        );
        emit NewEducationAdded(msg.sender, _degree, _institution);
    }

    function addSocialLinks(
        string memory _github,
        string memory _linkedin,
        string memory _instagram,
        string memory _twitter
    ) public {
        Resume storage myResume = resumes[msg.sender];
        myResume.socialLinks = SocialLinks({
            github: _github,
            linkedin: _linkedin,
            instagram: _instagram,
            twitter: _twitter
        });
    }

    function getResume(
        address _address
    )
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            string[] memory,
            string memory
        )
    {
        return (
            resumes[_address].name,
            resumes[_address].tagline,
            resumes[_address].location,
            resumes[_address].email,
            resumes[_address].skills,
            resumes[_address].aboutMe
        );
    }

    function getSocialLinks(
        address _address
    )
        public
        view
        returns (
            string memory github,
            string memory linkedin,
            string memory instagram,
            string memory twitter
        )
    {
        Resume storage myResume = resumes[_address];
        github = myResume.socialLinks.github;
        linkedin = myResume.socialLinks.linkedin;
        instagram = myResume.socialLinks.instagram;
        twitter = myResume.socialLinks.twitter;
    }

    function getExperienceLength(
        address _address
    ) public view returns (uint256) {
        return resumes[_address].experiences.length;
    }

    function getExperience(
        address _address,
        uint256 _index
    )
        public
        view
        returns (
            string memory jobTitle,
            string memory company,
            string memory startDate,
            string memory endDate,
            string memory description
        )
    {
        require(_index < resumes[_address].experiences.length, "Invalid index");
        Experiences storage experience = resumes[_address].experiences[_index];
        jobTitle = experience.jobTitle;
        company = experience.company;
        startDate = experience.startDate;
        endDate = experience.endDate;
        description = experience.description;
    }

    function getEducationLength(
        address _address
    ) public view returns (uint256) {
        return resumes[_address].educations.length;
    }

    function getEducation(
        address _address,
        uint256 _index
    )
        public
        view
        returns (
            string memory degree,
            string memory institution,
            string memory startDate,
            string memory endDate,
            string memory description
        )
    {
        Resume storage myResume = resumes[_address];
        require(_index < myResume.educations.length, "Invalid education index");
        Educations storage education = myResume.educations[_index];
        degree = education.degree;
        institution = education.institution;
        startDate = education.startDate;
        endDate = education.endDate;
        description = education.description;
    }
}
