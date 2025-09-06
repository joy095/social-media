import { Welcome } from '~/welcome/welcome';

export function meta() {
  return [
    { title: "Welcome - SocialApp" },
    { name: "description", content: "Welcome to SocialApp - Connect with friends and share your moments" },
  ];
}

export default function WelcomePage() {
  return <Welcome />;
}
