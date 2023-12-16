import AWS from "aws-sdk";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import { SyntheticEvent, useState, useContext } from "react";
import { UserContext } from "../../../App";
import { useMutation } from "@apollo/client";
import { UPDATE_PROFILE_IMG_URL } from "../../../queries";
import toast from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";

interface fileType {
	name: string;
	size: number;
	type: string;
}

export function ProfileForm() {
	const userContext = useContext(UserContext);
	if (!userContext) return null;
	const { user, imageUrl, setImageUrl } = userContext;
	const [updateProfileImageUrl] = useMutation(UPDATE_PROFILE_IMG_URL);

	const [file, setFile] = useState<fileType | null>(null);

	const S3_BUCKET = "mywishlistbucket";
	const REGION = "eu-north-1";

	AWS.config.update({
		accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
		secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
	});
	const s3 = new AWS.S3({
		params: { Bucket: S3_BUCKET },
		region: REGION,
	});

	const uploadFile = async (event: SyntheticEvent) => {
		event.preventDefault();

		if (!file || !user) {
			toast.error("No file selected!");
			return;
		}
		const toastId = toast.loading("Uploading profile picture...");

		var upload = s3
			.upload({
				Bucket: S3_BUCKET,
				Key: user?.id,
				Body: file,
			})
			.promise();

		await upload.then(() => {
			const newImageUrl = `https://mywishlistbucket.s3.eu-north-1.amazonaws.com/${user.id}`;
			updateProfileImageUrl({
				variables: {
					user_id: user.id,
					profile_img_url: newImageUrl,
				},
			});
			setImageUrl(`${newImageUrl}?${new Date().getTime()}`);
			user.refreshCustomData();
			toast.success("Profile picture uploaded!", { id: toastId });
		});
	};

	const handleFileChange = (e: any) => {
		if (e.target.files.length > 0) {
			// Uploaded file
			const file = e.target.files[0];
			// Changing file state
			setFile(file);
		}
	};

	function handleDeleteFile() {
		if (!user) return;
		const toastId = toast.loading("Deleting profile picture...");

		var params = {
			Bucket: S3_BUCKET,
			Key: user.id,
		};

		s3.deleteObject(params, function (err) {
			if (err) console.log(err, err.stack);
			else {
				const newImageUrl = "";
				updateProfileImageUrl({
					variables: {
						user_id: user.id,
						profile_img_url: newImageUrl,
					},
				});
				setImageUrl(newImageUrl);
				user.refreshCustomData();
				toast.success("Profile picture deleted!", { id: toastId });
			}
		});
	}

	return (
		<form onSubmit={uploadFile} className="space-y-6">
			<div className="space-y-2">
				<Label htmlFor="image">Profile picture</Label>
				<div className="flex flex-row border justify-between items-center p-4 rounded bg-white">
					<Avatar className="h-24 w-24 shadow-sm">
						<AvatarImage className="border rounded-full" src={imageUrl} alt="@shadcn" />
						<AvatarFallback className="text-4xl bg-slate-900 text-slate-50 hover:bg-slate-900/90">
							{user?.profile?.email?.slice(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div className="flex flex-col space-y-2">
						<Input id="image" type="file" accept="image/jpeg, image/png" onChange={handleFileChange} />
						<Button variant="destructive" type="button" onClick={handleDeleteFile}>
							Delete
						</Button>
					</div>
				</div>
			</div>
			<Button type="submit">Update profile</Button>
		</form>
	);
}
