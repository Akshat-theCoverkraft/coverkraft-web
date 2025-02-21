
export function truncateString(description, maxLength = 100) {
    if (description.length > maxLength) {
      return description?.slice(0, maxLength) + '...';
    }
    return description;
}

export function capitalizeFirstLetter(string) {
  return string?.charAt(0)?.toUpperCase() + string?.slice(1);
}
