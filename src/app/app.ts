import { Component, DestroyRef, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type EventKind = 'ceremony' | 'reception' | 'all';

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface WeddingEvent {
  title: string;
  start: string;
  end: string;
  location: string;
  details: string;
}

@Component({
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly countdown = signal<Countdown | null>(null);
  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const updateCountdown = () => {
        const remaining = Math.max(0, Date.parse('2027-01-18T10:00:00+05:30') - Date.now());
        const seconds = Math.floor(remaining / 1000);
        this.countdown.set({
          days: Math.floor(seconds / 86400),
          hours: Math.floor((seconds % 86400) / 3600),
          minutes: Math.floor((seconds % 3600) / 60),
          seconds: seconds % 60,
        });
      };

      updateCountdown();
      const timer = window.setInterval(updateCountdown, 1000);
      this.destroyRef.onDestroy(() => window.clearInterval(timer));
    }
  }

  protected calendarUrl(kind: EventKind): string {
    const events: Record<EventKind, WeddingEvent> = {
      ceremony: {
        title: 'Holy Matrimony | Renolin & Evanchelin',
        start: '2027-01-18T10:00:00+05:30',
        end: '2027-01-18T11:30:00+05:30',
        location: 'CSI Church Punniyadi, CSI Church Rd, Punnaiyadi, South Thamarai Kulam, Thenthamaraikulam, Tamil Nadu 629701',
        details: 'Holy Matrimony service for Renolin R and Evanchelin P.',
      },
      reception: {
        title: 'Wedding Reception | Renolin & Evanchelin',
        start: '2027-01-18T18:00:00+05:30',
        end: '2027-01-18T22:00:00+05:30',
        location: 'C.S.I Parish Hall, Pilankantuvilai',
        details: 'Wedding reception and dinner for Renolin R and Evanchelin P.',
      },
      all: {
        title: 'Renolin & Evanchelin | Wedding Day',
        start: '2027-01-18T10:00:00+05:30',
        end: '2027-01-18T22:00:00+05:30',
        location: 'Kanyakumari, Tamil Nadu',
        details: 'Holy Matrimony at 10:00 AM, followed by the wedding reception at 6:00 PM.',
      },
    };
    const event = events[kind];
    const formatDate = (value: string) =>
      new Date(value).toISOString().replaceAll(/[-:]/g, '').replace(/\.\d{3}/, '');
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${formatDate(event.start)}/${formatDate(event.end)}`,
      location: event.location,
      details: event.details,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }
}
