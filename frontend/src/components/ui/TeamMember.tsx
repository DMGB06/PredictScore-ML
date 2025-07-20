import React from "react";

interface TeamMemberProps {
  name: string;
}

const getInitials = (name: string): string => {
  const nameParts = name.split(" ");
  return nameParts.length >= 2
    ? `${nameParts[0][0]}${nameParts[1][0]}`
    : nameParts[0][0];
};

const TeamMember: React.FC<TeamMemberProps> = ({ name }) => (
  <div className="bg-white dark:bg-dark-card rounded-2xl shadow-lg dark:shadow-dark-accent/10 p-6 text-center border border-gray-100 dark:border-dark-border hover:shadow-xl dark:hover:shadow-dark-accent/20 transition-all duration-300 transform hover:-translate-y-1">
    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-dark-accent dark:to-indigo-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold">
      {getInitials(name)}
    </div>
    <h3 className="font-semibold text-gray-900 dark:text-dark-text text-sm">
      {name}
    </h3>
    <p className="text-gray-600 dark:text-dark-text/70 text-xs mt-1">
      Ingeniería de Sistemas
    </p>
  </div>
);

export default TeamMember;
