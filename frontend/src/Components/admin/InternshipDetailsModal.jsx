import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, MapPin, Briefcase, IndianRupee, Clock } from 'lucide-react';

export default function InternshipDetailsModal({ isOpen, onOpenChange, internship, onStatusChange }) {
  if (!internship) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-white">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-800">{internship.title}</DialogTitle>
              <DialogDescription className="text-md text-gray-600 mt-1">
                at {internship.companyName}
              </DialogDescription>
            </div>
            <img src={internship.companyLogoUrl || `https://avatar.vercel.sh/${internship.companyName}.png`} alt={internship.companyName} className="h-16 w-16 rounded-lg object-contain border p-1" />
          </div>
        </DialogHeader>
        <div className="mt-4 space-y-6">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-400" /> {internship.location}</div>
            <div className="flex items-center gap-2"><IndianRupee className="h-4 w-4 text-gray-400" /> {internship.stipend}</div>
            <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-gray-400" /> {internship.duration}</div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Job Description</h3>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{internship.description}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Recruiter Information</h3>
            <div className="text-sm text-gray-600">
              <p><strong>Name:</strong> {internship.recruiterName}</p>
              <p><strong>Email:</strong> {internship.recruiterEmail}</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
             <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
            {internship.status !== 'approved' && (
              <Button onClick={() => onStatusChange(internship.id, 'approved')} className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="mr-2 h-4 w-4" /> Approve
              </Button>
            )}
            {internship.status !== 'rejected' && (
              <Button onClick={() => onStatusChange(internship.id, 'rejected')} className="bg-red-600 hover:bg-red-700">
                <XCircle className="mr-2 h-4 w-4" /> Reject
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}