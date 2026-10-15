import { jsPDF } from 'jspdf';
import { DiaryItem } from '../types/travel';

export interface ItineraryPlanData {
  title: string;
  timeEstimate: string;
  budget: string;
  stops: Array<{
    time: string;
    spot: string;
    note: string;
  }>;
  transitTips: string;
}

export interface ItineraryOptions {
  duration?: 'half-day' | 'full-day' | 'three-day';
  pace?: 'walking' | 'transit' | 'foodie';
}

// Brand color palette constants
const COLOR_PRIMARY = [53, 30, 26] as const;       // #351E1A - Deep Espresso
const COLOR_ACCENT = [198, 83, 43] as const;       // #C6532B - Warm Terracotta
const COLOR_GOLD = [197, 162, 90] as const;        // #C5A25A - Heritage Gold
const COLOR_BG_LIGHT = [251, 246, 238] as const;   // #FBF6EE - Warm Cream
const COLOR_BORDER = [229, 213, 197] as const;     // #E5D5C5 - Dune Sand
const COLOR_TEXT_DARK = [45, 34, 30] as const;     // #2D221E - Charcoal Brown
const COLOR_TEXT_MUTED = [118, 99, 92] as const;   // #76635C - Sepia Muted
const COLOR_SUCCESS = [46, 125, 50] as const;      // #2E7D32 - Forest Green

/**
 * Format today's date in a refined editorial style: e.g. "October 15, 2026"
 */
function getFormattedDate(): string {
  try {
    return new Date().toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return 'Calcutta Field Edition';
  }
}

/**
 * Draws the top branded banner for document pages
 */
function drawHeaderBanner(
  doc: jsPDF,
  superTitle: string,
  title: string,
  subtitle: string,
  pageWidth: number
): number {
  // Top Banner background
  doc.setFillColor(...COLOR_PRIMARY);
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Gold accent line underneath
  doc.setFillColor(...COLOR_GOLD);
  doc.rect(0, 28, pageWidth, 1.5, 'F');

  // Supertitle
  doc.setTextColor(...COLOR_GOLD);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text(superTitle.toUpperCase(), 16, 9);

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('times', 'bold');
  doc.setFontSize(14.5);
  doc.text(title, 16, 17);

  // Subtitle / Date
  doc.setTextColor(230, 215, 200);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(subtitle, 16, 23);

  return 36; // Next Y coordinate below the banner
}

/**
 * Draws running headers for subsequent pages
 */
function drawSubsequentPageHeader(doc: jsPDF, documentTitle: string, pageWidth: number): number {
  doc.setFillColor(...COLOR_PRIMARY);
  doc.rect(0, 0, pageWidth, 12, 'F');

  doc.setFillColor(...COLOR_GOLD);
  doc.rect(0, 12, pageWidth, 1, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('WANDER CCU • ' + documentTitle.toUpperCase(), 16, 8);

  doc.setTextColor(...COLOR_GOLD);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(getFormattedDate(), pageWidth - 16, 8, { align: 'right' });

  return 20; // Next Y coordinate
}

/**
 * Applies running page numbers and archival footer across all pages
 */
function stampFooters(doc: jsPDF, label: string) {
  const pageCount = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Decorative top rule of footer
    doc.setDrawColor(...COLOR_BORDER);
    doc.setLineWidth(0.4);
    doc.line(16, pageHeight - 14, pageWidth - 16, pageHeight - 14);

    // Footer Left: Branding & City of Joy archive
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...COLOR_TEXT_MUTED);
    doc.text(`Wander CCU • ${label} • www.wanderccu.local`, 16, pageHeight - 9);

    // Footer Center: City Motto
    doc.setFont('times', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLOR_PRIMARY);
    doc.text('Calcutta — City of Joy Field Edition', pageWidth / 2, pageHeight - 9, {
      align: 'center',
    });

    // Footer Right: Page Count
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...COLOR_TEXT_MUTED);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 16, pageHeight - 9, { align: 'right' });
  }
}

/**
 * Downloads a neatly formatted, structured Day-Trip Itinerary as a PDF
 */
export function downloadItineraryPDF(
  plan: ItineraryPlanData,
  options?: ItineraryOptions
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  // 1. Draw Branded Top Banner
  let y = drawHeaderBanner(
    doc,
    'Wander CCU • Curated Exploration Series',
    'KOLKATA DAY-TRIP ITINERARY',
    `Tailored Self-Guided Route • Generated on ${getFormattedDate()}`,
    pageWidth
  );

  // 2. Plan Title Card & Overview
  doc.setFillColor(...COLOR_BG_LIGHT);
  doc.setDrawColor(...COLOR_BORDER);
  doc.setLineWidth(0.4);

  // Calculate Title text wrapping
  doc.setFont('times', 'bold');
  doc.setFontSize(14);
  const titleLines = doc.splitTextToSize(plan.title, contentWidth - 16);
  const titleBoxHeight = 14 + titleLines.length * 6;

  doc.roundedRect(margin, y, contentWidth, titleBoxHeight, 2.5, 2.5, 'FD');

  // Left decorative terracotta border strip
  doc.setFillColor(...COLOR_ACCENT);
  doc.roundedRect(margin, y, 2.5, titleBoxHeight, 1, 1, 'F');

  doc.setTextColor(...COLOR_PRIMARY);
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.text(titleLines, margin + 8, y + 8);

  y += titleBoxHeight + 5;

  // 3. Metadata Badges (Duration, Pace, Budget, Schedule)
  const paceLabel =
    options?.pace === 'foodie'
      ? 'Street Gastronomy'
      : options?.pace === 'transit'
      ? 'Tram & Ferry Transit'
      : 'Heritage Walking';

  const durationLabel =
    options?.duration === 'half-day'
      ? 'Half Day (4 Hours)'
      : options?.duration === 'three-day'
      ? '3 Days (Deep Heritage)'
      : 'Full Day (8–12 Hours)';

  const badges = [
    { label: 'DURATION', val: durationLabel },
    { label: 'PACE', val: paceLabel },
    { label: 'TIMING', val: plan.timeEstimate },
    { label: 'BUDGET', val: plan.budget },
  ];

  const colWidth = (contentWidth - 6) / 2;
  const badgeHeight = 12.5;

  badges.forEach((b, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const bx = margin + col * (colWidth + 6);
    const by = y + row * (badgeHeight + 3);

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...COLOR_BORDER);
    doc.setLineWidth(0.3);
    doc.roundedRect(bx, by, colWidth, badgeHeight, 1.5, 1.5, 'FD');

    // Label
    doc.setTextColor(...COLOR_ACCENT);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.text(b.label, bx + 4, by + 4.5);

    // Value
    doc.setTextColor(...COLOR_TEXT_DARK);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    const truncatedVal = doc.splitTextToSize(b.val, colWidth - 8)[0] || b.val;
    doc.text(truncatedVal, bx + 4, by + 9.5);
  });

  y += 2 * (badgeHeight + 3) + 4;

  // 4. Transit Tip Callout Box
  if (plan.transitTips) {
    doc.setFillColor(...COLOR_BG_LIGHT);
    doc.setDrawColor(...COLOR_GOLD);
    doc.setLineWidth(0.35);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const transitLines = doc.splitTextToSize(`Advisory: ${plan.transitTips}`, contentWidth - 12);
    const transitBoxHeight = 10 + transitLines.length * 4.2;

    doc.roundedRect(margin, y, contentWidth, transitBoxHeight, 2, 2, 'FD');

    // Accent line
    doc.setFillColor(...COLOR_GOLD);
    doc.rect(margin, y, 2.5, transitBoxHeight, 'F');

    doc.setTextColor(...COLOR_PRIMARY);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('NAVIGATIONAL & TRANSIT ADVICE', margin + 6, y + 5);

    doc.setTextColor(...COLOR_TEXT_DARK);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(transitLines, margin + 6, y + 10);

    y += transitBoxHeight + 7;
  }

  // 5. Stops & Timeline Section Title
  doc.setDrawColor(...COLOR_BORDER);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  doc.setTextColor(...COLOR_PRIMARY);
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.text('SCHEDULED EXPEDITION STOPS', margin, y);

  doc.setTextColor(...COLOR_ACCENT);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text(`${plan.stops.length} STOPS IDENTIFIED`, pageWidth - margin, y, { align: 'right' });

  y += 5;

  // 6. Iterate through Stops
  plan.stops.forEach((stop, index) => {
    // Measure content height
    doc.setFont('times', 'bold');
    doc.setFontSize(10.5);
    const spotLines = doc.splitTextToSize(stop.spot, contentWidth - 36);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    const noteLines = doc.splitTextToSize(stop.note, contentWidth - 36);

    const stopCardHeight = 10 + spotLines.length * 5 + noteLines.length * 4.2;

    // Check for page overflow
    if (y + stopCardHeight > pageHeight - 20) {
      doc.addPage();
      y = drawSubsequentPageHeader(doc, 'Kolkata Day-Trip Itinerary', pageWidth);
    }

    // Stop Card Background
    doc.setFillColor(index % 2 === 0 ? 255 : 252, index % 2 === 0 ? 255 : 249, index % 2 === 0 ? 255 : 245);
    doc.setDrawColor(...COLOR_BORDER);
    doc.setLineWidth(0.25);
    doc.roundedRect(margin, y, contentWidth, stopCardHeight, 2, 2, 'FD');

    // Time Capsule Badge on left
    const badgeW = 28;
    const badgeH = 7.5;
    doc.setFillColor(...COLOR_PRIMARY);
    doc.roundedRect(margin + 3, y + 3, badgeW, badgeH, 1.2, 1.2, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text(stop.time, margin + 3 + badgeW / 2, y + 7.8, { align: 'center' });

    // Spot Name
    doc.setTextColor(...COLOR_PRIMARY);
    doc.setFont('times', 'bold');
    doc.setFontSize(10.5);
    doc.text(spotLines, margin + 35, y + 7.5);

    // Spot Note / Curated details
    const noteStartY = y + 8 + spotLines.length * 5;
    doc.setTextColor(...COLOR_TEXT_MUTED);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(noteLines, margin + 35, noteStartY);

    y += stopCardHeight + 3.5;
  });

  // 7. Traveler Field Notes Ruled Section
  if (y + 35 <= pageHeight - 22) {
    y += 2;
    doc.setFillColor(...COLOR_BG_LIGHT);
    doc.setDrawColor(...COLOR_BORDER);
    doc.setLineWidth(0.3);
    const notesBoxH = Math.min(30, pageHeight - y - 18);
    doc.roundedRect(margin, y, contentWidth, notesBoxH, 2, 2, 'FD');

    doc.setTextColor(...COLOR_PRIMARY);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text('TRAVELER MEMOS & SOUVENIR STAMP AREA', margin + 5, y + 5);

    // Ruled lines for handwriting
    doc.setDrawColor(...COLOR_BORDER);
    doc.setLineDashPattern([1, 2], 0);
    const lineSpacing = 6;
    for (let ly = y + 10; ly < y + notesBoxH - 3; ly += lineSpacing) {
      doc.line(margin + 5, ly, pageWidth - margin - 5, ly);
    }
    doc.setLineDashPattern([], 0); // Reset dash
  }

  // 8. Stamp footers across all pages
  stampFooters(doc, 'Itinerary Planner');

  // 9. Trigger browser download
  const cleanTitle = plan.title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
  doc.save(`Calcutta_Plan_${cleanTitle}.pdf`);
}

/**
 * Downloads user's personal Pocket Diary as a neat, structured archival PDF
 */
export function downloadDiaryPDF(diaryItems: DiaryItem[]): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  // 1. Draw Branded Top Banner
  let y = drawHeaderBanner(
    doc,
    'Wander CCU • Personal Heritage Codex',
    'MY CALCUTTA POCKET DIARY',
    `Curated Saved Spots & Personal Field Notes • Generated on ${getFormattedDate()}`,
    pageWidth
  );

  // 2. Summary Statistics Card
  const totalSpots = diaryItems.length;
  const visitedCount = diaryItems.filter((i) => i.visited).length;
  const pendingCount = totalSpots - visitedCount;
  const completionPercent = totalSpots > 0 ? Math.round((visitedCount / totalSpots) * 100) : 0;

  doc.setFillColor(...COLOR_BG_LIGHT);
  doc.setDrawColor(...COLOR_BORDER);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, 20, 2.5, 2.5, 'FD');

  // Left terracotta accent stripe
  doc.setFillColor(...COLOR_ACCENT);
  doc.roundedRect(margin, y, 2.5, 20, 1, 1, 'F');

  // Stats columns
  const statColW = (contentWidth - 10) / 4;
  const stats = [
    { label: 'TOTAL SAVED', val: `${totalSpots} Spots` },
    { label: 'VISITED', val: `${visitedCount} Explored` },
    { label: 'REMAINING', val: `${pendingCount} To Visit` },
    { label: 'EXPEDITION', val: `${completionPercent}% Complete` },
  ];

  stats.forEach((st, i) => {
    const sx = margin + 6 + i * statColW;
    doc.setTextColor(...COLOR_ACCENT);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.text(st.label, sx, y + 6.5);

    doc.setTextColor(...COLOR_PRIMARY);
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.text(st.val, sx, y + 14);
  });

  y += 26;

  // 3. Section Divider & Title
  doc.setTextColor(...COLOR_PRIMARY);
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.text('SAVED CALCUTTA SPOTS & PERSONAL FIELD NOTES', margin, y);

  doc.setTextColor(...COLOR_TEXT_MUTED);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`${totalSpots} Entries Recorded`, pageWidth - margin, y, { align: 'right' });

  y += 4;
  doc.setDrawColor(...COLOR_BORDER);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  // Handle empty diary case gracefully
  if (diaryItems.length === 0) {
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...COLOR_BORDER);
    doc.roundedRect(margin, y, contentWidth, 35, 2, 2, 'FD');

    doc.setTextColor(...COLOR_PRIMARY);
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.text('Your Calcutta Pocket Diary is currently empty.', margin + 10, y + 15);

    doc.setTextColor(...COLOR_TEXT_MUTED);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(
      'Bookmark heritage sites, culinary cabins, and walking trails while exploring Wander CCU to curate your personalized journal.',
      margin + 10,
      y + 23
    );

    stampFooters(doc, 'Pocket Diary');
    doc.save('Wander_CCU_Pocket_Diary.pdf');
    return;
  }

  // 4. Iterate over Diary Items
  diaryItems.forEach((item, index) => {
    // Measure dynamic item height
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    const titleLines = doc.splitTextToSize(item.title, contentWidth - 45);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const locLines = doc.splitTextToSize(`Location: ${item.location}`, contentWidth - 45);

    let noteLines: string[] = [];
    let noteBoxHeight = 0;
    if (item.notes && item.notes.trim()) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      noteLines = doc.splitTextToSize(`Field Note: "${item.notes.trim()}"`, contentWidth - 22);
      noteBoxHeight = 6 + noteLines.length * 4.2;
    } else {
      // Small lined space for handwritten notes
      noteBoxHeight = 8;
    }

    const cardHeight = 12 + titleLines.length * 5 + locLines.length * 4 + noteBoxHeight;

    // Check for page break
    if (y + cardHeight > pageHeight - 20) {
      doc.addPage();
      y = drawSubsequentPageHeader(doc, 'My Calcutta Pocket Diary', pageWidth);
    }

    // Card frame
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...COLOR_BORDER);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, contentWidth, cardHeight, 2, 2, 'FD');

    // Index & Category badge
    const badgeCategory = (item.category || 'Spot').toUpperCase();
    doc.setFillColor(...COLOR_PRIMARY);
    doc.roundedRect(margin + 3, y + 3, 24, 6.5, 1, 1, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.text(badgeCategory, margin + 15, y + 7.2, { align: 'center' });

    // Status Pill (Visited vs Planned)
    if (item.visited) {
      doc.setFillColor(232, 245, 233); // light green
      doc.setDrawColor(...COLOR_SUCCESS);
      doc.setLineWidth(0.2);
      doc.roundedRect(margin + 29, y + 3, 20, 6.5, 1, 1, 'FD');
      doc.setTextColor(...COLOR_SUCCESS);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6);
      doc.text('VISITED', margin + 39, y + 7.2, { align: 'center' });
    } else {
      doc.setFillColor(...COLOR_BG_LIGHT);
      doc.setDrawColor(...COLOR_BORDER);
      doc.setLineWidth(0.2);
      doc.roundedRect(margin + 29, y + 3, 22, 6.5, 1, 1, 'FD');
      doc.setTextColor(...COLOR_ACCENT);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6);
      doc.text('TO EXPLORE', margin + 40, y + 7.2, { align: 'center' });
    }

    // Date logged on right
    doc.setTextColor(...COLOR_TEXT_MUTED);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.text(`Saved: ${item.addedAt || 'Recorded'}`, pageWidth - margin - 4, y + 7.5, {
      align: 'right',
    });

    // Item Title
    const titleY = y + 14;
    doc.setTextColor(...COLOR_PRIMARY);
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.text(titleLines, margin + 6, titleY);

    // Location
    const locY = titleY + titleLines.length * 5;
    doc.setTextColor(...COLOR_TEXT_MUTED);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(locLines, margin + 6, locY);

    // Notes area
    const noteAreaY = locY + locLines.length * 4 + 1;
    if (item.notes && item.notes.trim()) {
      doc.setFillColor(...COLOR_BG_LIGHT);
      doc.setDrawColor(...COLOR_GOLD);
      doc.setLineWidth(0.25);
      doc.roundedRect(margin + 5, noteAreaY, contentWidth - 10, noteBoxHeight - 1, 1.2, 1.2, 'FD');

      doc.setTextColor(...COLOR_PRIMARY);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.text(noteLines, margin + 8, noteAreaY + 4.5);
    } else {
      // Dotted line for physical field memo
      doc.setTextColor(...COLOR_TEXT_MUTED);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('Field Reflection: __________________________________________________________________', margin + 6, noteAreaY + 4);
    }

    y += cardHeight + 4;
  });

  // 5. Stamp footers across all pages
  stampFooters(doc, 'Pocket Codex & Diary');

  // 6. Trigger direct download
  doc.save(`My_Calcutta_Pocket_Diary_${new Date().toISOString().slice(0, 10)}.pdf`);
}
