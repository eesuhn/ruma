export const getBadgeVariant = (status?: string) => {
  switch (status) {
    case 'pending':
      return 'outline';
    case 'going':
      return 'default';
    case 'checked-in':
      return 'default';
    case 'rejected':
      return 'destructive';
    default:
      return 'secondary';
  }
};
