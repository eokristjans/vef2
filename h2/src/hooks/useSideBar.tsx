import { useState, useEffect } from 'react';

/**
 * A hook for states used in the SideBar.
 */
export default function useSideBar() {
  const [notebookId, setNotebookId] = useState(0);
  const [sectionId, setSectionId] = useState(0);
  const [pageId, setPageId] = useState(0);

  return { notebookId, sectionId, pageId, setNotebookId, setSectionId, setPageId };
}