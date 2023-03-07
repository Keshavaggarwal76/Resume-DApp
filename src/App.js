import "./App.css";
import Header from "./components/Header";
import AnimatedRoutes from "./components/AnimatedRoutes";
import React, { useState, useEffect, useRef } from "react";
import getWeb3 from "./getWeb3";
import ResumeContract from "./contracts/ResumeContract.json";
import AddResume from "./components/AddResume";

function App() {
  const [personalDetails, setPersonalDetails] = useState({
    name: "",
    location: "",
    tagline: "",
    email: "",
    skills: [],
    aboutMe: "",
  });
  const [experience, setExperience] = useState({
    jobTitle: "",
    company: "",
    startDate: "",
    endDate: "Present",
    description: "",
  });
  const [education, setEducation] = useState({
    degree: "",
    institution: "",
    startDate: "",
    endDate: "Present",
    description: "",
  });
  const [socialLinks, setSocialLinks] = useState({
    github: "",
    linkedin: "",
    instagram: "",
    twitter: "",
  });
  const [showResume, setShowResume] = useState(false);

  const onChange = (e) =>
    setPersonalDetails({ ...personalDetails, [e.target.name]: e.target.value });
  const onChangeExperience = (e) =>
    setExperience({ ...experience, [e.target.name]: e.target.value });
  const onChangeEducation = (e) =>
    setEducation({ ...education, [e.target.name]: e.target.value });
  const onChangeSocialLinks = (e) =>
    setSocialLinks({ ...socialLinks, [e.target.name]: e.target.value });

  const ResumeContractContractRef = useRef(null);
  const web3 = useRef(null);
  const [currentAccount, setCurrentAccount] = useState("");

  const [isFirstUseEffectCompleted, setIsFirstUseEffectCompleted] =
    useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const web = await getWeb3();
        web3.current = web;
        setCurrentAccount(await web.eth.currentProvider.selectedAddress);
        const networkId = await web.eth.net.getId();
        const ResumeContractContract = await new web.eth.Contract(
          ResumeContract.abi,
          ResumeContract.networks[networkId] &&
            ResumeContract.networks[networkId].address
        );
        ResumeContractContractRef.current = await ResumeContractContract;
      } catch (error) {
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    }
    fetchData().then(() => setIsFirstUseEffectCompleted(true));
  }, []);

  const addResume = async () => {
    await ResumeContractContractRef.current.methods
      .addResume(
        personalDetails.name,
        personalDetails.tagline,
        personalDetails.location,
        personalDetails.email,
        personalDetails.skills.split(","),
        personalDetails.aboutMe
      )
      .send({ from: currentAccount })
      .on("receipt", function (receipt) {
        alert(
          receipt.events.NewResumeAdded.returnValues[1] + " added successfully"
        );
        setPersonalDetails({
          name: "",
          location: "",
          tagline: "",
          email: "",
          skills: [],
          aboutMe: "",
        });
      })
      .on("error", function (error) {
        alert(error.message);
      })
      .on("myEvent", function (event) {
        alert("My event: ", event);
      });
  };

  const addExperience = async () => {
    if (
      experience.startDate < experience.endDate ||
      experience.endDate === "Present"
    ) {
      await ResumeContractContractRef.current.methods
        .addExperience(
          experience.jobTitle,
          experience.company,
          experience.startDate.toString(),
          experience.endDate.toString(),
          experience.description
        )
        .send({ from: currentAccount })
        .on("receipt", function (receipt) {
          alert(
            receipt.events.NewExperienceAdded.returnValues[1] +
              " added successfully"
          );
          setExperience({
            jobTitle: "",
            company: "",
            startDate: "",
            endDate: "Present",
            description: "",
          });
        })
        .on("error", function (error) {
          alert(error.message);
        })
        .on("myEvent", function (event) {
          alert("My event: ", event);
        });
    } else {
      alert(new Error("Start Date should be less than end date"));
    }
  };

  const addEducation = async () => {
    if (
      education.startDate < education.endDate ||
      education.endDate === "Present"
    ) {
      await ResumeContractContractRef.current.methods
        .addEducation(
          education.degree,
          education.institution,
          education.startDate.toString(),
          education.endDate.toString(),
          education.description
        )
        .send({ from: currentAccount })
        .on("receipt", function (receipt) {
          alert(
            receipt.events.NewEducationAdded.returnValues[1] +
              " added successfully"
          );
          setEducation({
            degree: "",
            institution: "",
            startDate: "",
            endDate: "Present",
            description: "",
          });
        })
        .on("error", function (error) {
          alert(error.message);
        })
        .on("myEvent", function (event) {
          alert("My event: ", event);
        });
    } else {
      alert(new Error("Start Date should be less than end date"));
    }
  };

  const addSocialLinks = async () => {
    await ResumeContractContractRef.current.methods
      .addSocialLinks(
        socialLinks.github,
        socialLinks.linkedin,
        socialLinks.instagram,
        socialLinks.twitter
      )
      .send({ from: currentAccount })
      .on("receipt", function (receipt) {
        alert("Links added successfully");
        setSocialLinks({
          github: "",
          linkedin: "",
          instagram: "",
          twitter: "",
        });
      })
      .on("error", function (error) {
        alert(error.message);
      })
      .on("myEvent", function (event) {
        alert("My event: ", event);
      });
  };

  const [educationLength, setEducationLength] = useState(0);
  const [experienceLength, setExperienceLength] = useState(0);
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [personalDetail, setPersonalDetail] = useState({});
  const [socialLink, setSocialLink] = useState({});
  useEffect(() => {
    const getResume = async () => {
      if (isFirstUseEffectCompleted && ResumeContractContractRef.current) {
        await ResumeContractContractRef.current.methods
          .getResume(currentAccount)
          .call({ from: currentAccount }, (err, data) => {
            setPersonalDetail(data);
            if (data) setShowResume(true);
          });
        getExperienceLength();
        getEducationLength();
        getSocialLinks();
        for (let i = 0; i < experienceLength; i++) {
          getExperience(i);
        }
        for (let i = 0; i < educationLength; i++) {
          getEducation(i);
        }
      }
    };

    const getSocialLinks = async () => {
      await ResumeContractContractRef.current.methods
        .getSocialLinks(currentAccount)
        .call({ from: currentAccount }, (err, data) => setSocialLink(data));
    };

    const getExperienceLength = async () => {
      await ResumeContractContractRef.current.methods
        .getExperienceLength(currentAccount)
        .call({ from: currentAccount }, (err, data) =>
          setExperienceLength(data)
        );
    };

    const getExperience = async (i) => {
      await ResumeContractContractRef.current.methods
        .getExperience(currentAccount, i)
        .call({ from: currentAccount }, (err, data) =>
          setExperiences((experience) => [...experience, data])
        );
    };

    const getEducationLength = async () => {
      await ResumeContractContractRef.current.methods
        .getEducationLength(currentAccount)
        .call({ from: currentAccount }, (err, data) =>
          setEducationLength(data)
        );
    };

    const getEducation = async (i) => {
      await ResumeContractContractRef.current.methods
        .getEducation(currentAccount, i)
        .call({ from: currentAccount }, (err, data) =>
          setEducations((education) => [...education, data])
        );
    };

    getResume();
  }, [
    isFirstUseEffectCompleted,
    experienceLength,
    educationLength,
    currentAccount,
  ]);

  return (
    <>
      {showResume ? (
        <>
          <Header />
          <AnimatedRoutes
            personalDetail={personalDetail}
            experiences={experiences}
            educations={educations}
            socialLinks={socialLink}
          />
        </>
      ) : (
        <AddResume
          personalDetails={personalDetails}
          experience={experience}
          education={education}
          socialLinks={socialLinks}
          onChange={onChange}
          onChangeExperience={onChangeExperience}
          onChangeEducation={onChangeEducation}
          onChangeSocialLinks={onChangeSocialLinks}
          addResume={addResume}
          addExperience={addExperience}
          addEducation={addEducation}
          addSocialLinks={addSocialLinks}
        />
      )}
    </>
  );
}

export default App;
