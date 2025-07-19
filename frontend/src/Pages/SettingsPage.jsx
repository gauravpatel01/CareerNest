import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function SettingsPage() {
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    console.log("Password changed.");
  };

  const handleResetPassword = () => {
    alert("Reset link sent to your registered email.");
  };

  const handleDeleteAccount = () => {
    console.log("Account deletion triggered.");
    setShowDeleteConfirm(false);
  };

  const handleUpdateUsername = () => {
    console.log("handle username triggered");
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-blue-50 rounded-lg">
      <h1 className="text-2xl font-bold mb-2">Account Settings</h1>
      <p className="text-sm text-gray-600 mb-6">Manage your credentials and account preferences.</p>

      {/* Username Update */}
      <div className="space-y-2 mb-6">
        <label className="text-sm font-medium text-gray-700">Username</label>
        <Input placeholder="New username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <Button variant="default" className="text-white bg-blue-500 hover:bg-blue-600" onClick={handleUpdateUsername}>
          Update Username
        </Button>
      </div>

      {/* Change Password */}
      <div className="space-y-2 mb-6 border-t pt-4">
        <label className="text-sm font-medium text-gray-700">Change Password</label>
        <Input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <div className="flex gap-2 mt-3">
          <Button variant="default" className="text-white bg-blue-500 hover:bg-blue-600" onClick={handleChangePassword}>
            Update Password
          </Button>
          <Button variant="outline" className="hover:bg-gray-100" onClick={handleResetPassword}>
            Forgot Password?
          </Button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="border-t pt-4">
        <label className="text-sm font-semibold text-red-600">Delete Account</label>
        <p className="text-sm text-gray-500 mb-2">This action is irreversible.</p>
        <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
          Delete Account
        </Button>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="mt-4 p-4 bg-red-50 border border-red-300 rounded-lg space-y-3">
          <p className="text-sm text-red-600 font-semibold">Are you absolutely sure?</p>
          <p className="text-sm text-gray-700">This will permanently delete your account and all associated data.</p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Yes, Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
