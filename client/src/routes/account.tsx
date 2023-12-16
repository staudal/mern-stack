import { Separator } from "../components/ui/separator";
import SettingsLayout from "../components/ui/profile/layout";
import { AccountForm } from "../components/ui/profile/account-form";

export default function Account() {
	return (
		<SettingsLayout>
			<div className="space-y-6">
				<div>
					<h3 className="text-lg font-medium">Account</h3>
					<p className="text-sm text-muted-foreground">Change your account settings.</p>
				</div>
				<Separator />
				<AccountForm />
			</div>
		</SettingsLayout>
	);
}
