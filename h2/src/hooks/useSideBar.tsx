import { useState, useEffect } from 'react';

/**
 * A hook for states used in the SideBar.
 */
export default function useSideBar() {
  const [notebookId, setNotebookId] = useState(1);
  const [sectionId, setSectionId] = useState(1);
  const [pageId, setPageId] = useState(1);

  return { notebookId, sectionId, pageId, setNotebookId, setSectionId, setPageId };
}