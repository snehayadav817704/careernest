import Button from "../../components/ui/Button";
import Icon from "../../components/ui/Icon";
import usePageTitle from "../../hooks/usePageTitle";

export default function VerifyEmailPage() {
  usePageTitle("Verify Email");
  return (
    <section className="glass-panel w-full max-w-xl rounded-xl p-8 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-primary text-white">
        <Icon name="mail" />
      </div>
      <h1 className="font-display text-3xl font-bold text-navy">Verify your email</h1>
      <p className="mt-3 leading-7 text-secondary">We sent a verification link to your inbox. Use the success state below to continue the demo flow.</p>
      <Button to="/email-verified" className="mt-8">I verified my email</Button>
    </section>
  );
}
