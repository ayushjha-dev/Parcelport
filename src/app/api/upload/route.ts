import { NextResponse } from 'next/server';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { errorResponse, successResponse } from '@/lib/api-utils';
import { storage } from '@/lib/firebase/client';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucket = formData.get('bucket') as string || 'payment-screenshots';

    if (!file) {
      return errorResponse('No file provided', 400);
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return errorResponse('File size exceeds 5MB limit', 400);
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${bucket}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload to Firebase Storage
    const storageRef = ref(storage, fileName);
    await uploadBytes(storageRef, buffer);

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);

    return successResponse({ 
      url: downloadURL, 
      path: fileName,
      name: file.name,
      size: file.size
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return errorResponse(error instanceof Error ? error.message : 'File upload failed');
  }
}
