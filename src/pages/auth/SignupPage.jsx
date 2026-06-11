import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Icon from "../../components/ui/Icon";
import usePageTitle from "../../hooks/usePageTitle";

export default function SignupPage() {
  const navigate = useNavigate();
  usePageTitle("Signup");

  return (
    <section className="glass-panel w-full max-w-2xl rounded-xl p-6 md:p-10">
      <h1 className="font-display text-3xl font-bold text-navy">Create your CareerNest account</h1>
      <p className="mt-2 text-secondary">Start with the basics. Backend integration can replace this demo flow later.</p>
      <form onSubmit={(event) => { event.preventDefault(); navigate("/verify-email"); }} className="mt-8 grid gap-4">
        <input className="rounded-lg border border-outline-variant bg-white/75 px-4 py-3 outline-none focus:border-primary" placeholder="Full name" />
        <input className="rounded-lg border border-outline-variant bg-white/75 px-4 py-3 outline-none focus:border-primary" placeholder="Email address" type="email" />
        <input className="rounded-lg border border-outline-variant bg-white/75 px-4 py-3 outline-none focus:border-primary" placeholder="Password" type="password" />
        <select className="rounded-lg border border-outline-variant bg-white/75 px-4 py-3 outline-none focus:border-primary">
          <option>Candidate</option>
          <option>Employer</option>
        </select>
        <Button className="mt-2" type="submit">Create account <Icon name="mark_email_read" /></Button>
      </form>
    </section>
  );
}
