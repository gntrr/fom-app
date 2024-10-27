import Swal from 'sweetalert2';

// Success Alert
export const showSuccessAlert = (title, text) => {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonText: 'OK',
    confirmButtonColor: '#3085d6',
  });
};

// Error Alert
export const showErrorAlert = (title, text) => {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonText: 'OK',
    confirmButtonColor: '#d33',
  });
};

// Confirmation Alert (e.g., for deletions)
export const showConfirmationAlert = (title, text) => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, proceed!',
  });
};
