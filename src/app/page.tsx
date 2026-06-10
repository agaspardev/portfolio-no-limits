import profile from "@/data/profile.json";
import skills from "@/data/skills.json";
import experience from "@/data/experience.json";
import projects from "@/data/projects.json";
import socialLinks from "@/data/social-links.json";
import cv from "@/data/cv.json";
import site from "@/data/site.json";

import { CommandCenterSection } from "@/components/sections/CommandCenterSection";
import { SystemProfileSection } from "@/components/sections/SystemProfileSection";
import { CurrentFocusSection } from "@/components/sections/CurrentFocusSection";
import { CapabilityMatrixSection } from "@/components/sections/CapabilityMatrixSection";
import { OperationalTimelineSection } from "@/components/sections/OperationalTimelineSection";
import { ProjectLabSection } from "@/components/sections/ProjectLabSection";
import { CredentialVaultSection } from "@/components/sections/CredentialVaultSection";
import { ProfessionalCVSection } from "@/components/sections/ProfessionalCVSection";
import { ContactGatewaySection } from "@/components/sections/ContactGatewaySection";
import type { CVData, ExperienceItem, Profile, Project, SkillGroup, SocialLink, SiteConfig } from "@/types/portfolio";

export default function HomePage() {
  const visibleSections = (site as SiteConfig).ui?.sections ?? {};
  const typedProfile = profile as Profile;
  const typedSkills = skills as SkillGroup[];
  const typedExperience = experience as ExperienceItem[];
  const typedProjects = projects as Project[];
  const typedSocialLinks = socialLinks as SocialLink[];
  const typedCv = cv as CVData;

  return (
    <>
      <CommandCenterSection profile={typedProfile} cv={typedCv} />
      {visibleSections.profile !== false && <SystemProfileSection profile={typedProfile} />}
      {visibleSections.focus !== false && <CurrentFocusSection />}
      {visibleSections.skills !== false && <CapabilityMatrixSection skills={typedSkills} />}
      {visibleSections.credentials !== false && <CredentialVaultSection cv={typedCv} />}
      {visibleSections.experience !== false && <OperationalTimelineSection experience={typedExperience} />}
      {visibleSections.projects !== false && <ProjectLabSection projects={typedProjects} />}
      {visibleSections.cv !== false && <ProfessionalCVSection cv={typedCv} />}
      {visibleSections.contact !== false && <ContactGatewaySection socialLinks={typedSocialLinks} />}
    </>
  );
}
