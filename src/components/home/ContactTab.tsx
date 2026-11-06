import { SubmitEvent } from "react";
import { toast } from "sonner";

import Button from "../primitives/Button";
import Divider from "../primitives/Divider";
import Input from "../primitives/Input";

export default function ContactTab({ visible }: { visible?: boolean }) {
	async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		formData.append("access_key", "0ce3c452-83f4-420b-8ee1-97784e0029d4");

		const response = await fetch("https://api.web3forms.com/submit", {
			method: "POST",
			body: formData
		});

		const data = await response.json();
		if (data.success) {
			toast.success("Your message has been sent!", { description: "Please allow 1-2 weeks for a response." });
			(event.target as HTMLFormElement).reset();
		} else
			toast.error("Something went wrong. Please try again later.");
	}

	return <form className={`${visible ? "block" : "hidden"} w-full`} onSubmit={onSubmit}>
		<Input type="text" name="name" label="Name" required className="w-full" placeholder="W.D. Gaster" />
		<Input type="email" name="email" label="Email" required className="w-full" placeholder="sjelter@deltarune.com" />
		<Input name="message" label="Message" required multiline className="w-full min-h-25" placeholder={"VERY\nVERY\nINTERESTING"} />
		<Divider />
		<Button type="submit">Submit</Button>
	</form>;
}
