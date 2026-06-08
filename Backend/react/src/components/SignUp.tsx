import {
	RegisterSchema,
	type RegisterSchemaType,
} from "../schema/RegisterSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const SignUp = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<RegisterSchemaType>({
		resolver: zodResolver(RegisterSchema),
	});

	const onSubmit = (data: RegisterSchemaType) => {
		console.log(data);
	};

	return (
		<div className="bg-white flex flex-col items-center justify-center p-8 rounded-lg shadow-md h-fit w-1/5">
			<h1 className="text-2xl font-bold mb-4">Sign Up</h1>
			<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
				<input
					type="text"
					name="name"
					placeholder="Name"
					{...register("name")}
					className="w-full px-4 py-2 rounded-md border border-gray-400"
				/>
				{errors.name && <p>{errors.name.message}</p>}
				<input
					type="email"
					name="email"
					placeholder="Email"
					{...register("email")}
					className="w-full px-4 py-2 rounded-md border border-gray-400"
				/>
				{errors.email && <p>{errors.email.message}</p>}
				<input
					type="password"
					name="password"
					placeholder="Password"
					{...register("password")}
					className="w-full px-4 py-2 rounded-md border-2 border-gray-400"
				/>
				{errors.password && <p>{errors.password.message}</p>}
				<button
					className="bg-blue-500 text-white p-2 rounded-md"
					type="submit"
					disabled={isSubmitting}
				>
					{isSubmitting ? "Signing Up..." : "Sign Up"}
				</button>
			</form>
		</div>
	);
};
