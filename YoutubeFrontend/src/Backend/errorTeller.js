function errorTeller(error) {
  if (error.response) {
    const htmlData = error.response.data; // Raw HTML response
    const match = htmlData.match(/<pre>(.*?)<br>/s); // Extract <pre> content
    if (match) {
      const finErr = match[1].trim();
      return finErr;
    }
  } else {
    return error.message;
  }
}

export default errorTeller;
