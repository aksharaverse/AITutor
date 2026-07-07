import { Injectable } from '@angular/core';
import { Observable, of, concat } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AiTutorService {
  private responses: { [key: string]: { keywords: string[], reply: string }[] } = {
    math: [
      {
        keywords: ['calculus', 'derivative', 'integral', 'math'],
        reply: "Calculus is the mathematical study of continuous change. Derivatives measure the rate of change (like speed), while integrals compute accumulation (like distance or area under a curve). For example, the derivative of f(x) = x² is f'(x) = 2x!"
      },
      {
        keywords: ['algebra', 'equation', 'solve'],
        reply: "To solve any algebraic equation, the main goal is to isolate the variable (usually 'x'). Remember to perform the same operation on both sides of the equal sign to keep it balanced. E.g., if 2x + 5 = 15, subtract 5 from both sides (2x = 10) then divide by 2 (x = 5)."
      }
    ],
    science: [
      {
        keywords: ['gravity', 'black hole', 'physics', 'science'],
        reply: "Gravity is a fundamental force of attraction between masses. Einstein's General Relativity describes gravity not as a force, but as the bending of spacetime caused by mass and energy. A black hole is where gravity is so strong that even light cannot escape!"
      },
      {
        keywords: ['quantum', 'atom', 'particle'],
        reply: "Quantum physics is the study of matter and energy at the nanoscopic scale. At this level, particles exhibit wave-particle duality (acting as both waves and particles) and can exist in multiple states at once (superposition) until measured."
      }
    ],
    history: [
      {
        keywords: ['space', 'moon', 'apollo', 'history'],
        reply: "The Space Race was a 20th-century competition between the Soviet Union and the United States for dominance in spaceflight capability. It culminated on July 20, 1969, when Apollo 11 landed astronauts Neil Armstrong and Buzz Aldrin on the Moon."
      },
      {
        keywords: ['civilization', 'egypt', 'rome'],
        reply: "Ancient Egypt thrived along the Nile River, famous for its pyramids and hieroglyphs. Meanwhile, Rome grew from a small republic into a colossal empire spanning the Mediterranean, leaving legacies in law, architecture, and governance."
      }
    ],
    coding: [
      {
        keywords: ['angular', 'signals', 'framework', 'coding', 'programming'],
        reply: "Angular 18 introduces powerful features like Signals for fine-grained reactivity, deferrable views (`@defer`) for outstanding rendering performance, and a new control flow (`@if`/`@for`). It enables robust, scalable single-page apps!"
      },
      {
        keywords: ['javascript', 'promise', 'async'],
        reply: "Promises in JavaScript represent the eventual completion (or failure) of an asynchronous operation. Using `async/await` syntax makes your asynchronous code look and behave like synchronous code, making it much easier to read and maintain."
      }
    ]
  };

  private defaultReplies = [
    "Honest answer: I can't verify a solution to this one yet, and I'd rather tell you that than guess. Try one of the quick prompts to see a machine-checked explanation.",
    "I don't have a verified solution for this question in my bank. Rather than risk teaching you a wrong step, I'm flagging it as unverified — ask me a math or science question to see verification in action.",
    "This falls outside what I can machine-check right now. A confident wrong answer is worse than an honest 'I'm not sure' — that's the whole point of AITutor."
  ];

  constructor() {}

  // Simulates the verifier gate: known bank answers count as machine-checked,
  // anything falling through to a default reply is an honest abstention
  isVerifiable(subject: string, question: string): boolean {
    const sub = subject.toLowerCase();
    const q = question.toLowerCase();
    const subjectList = this.responses[sub] || [];
    if (subjectList.some(item => item.keywords.some(kw => q.includes(kw)))) {
      return true;
    }
    return Object.values(this.responses).some(list =>
      list.some(item => item.keywords.some(kw => q.includes(kw)))
    );
  }

  // Simulates AI streaming back words
  streamResponse(subject: string, question: string): Observable<string> {
    const text = this.getReply(subject.toLowerCase(), question.toLowerCase());
    const words = text.split(' ');
    
    // Create an array of observables that each emit a word after a slight random delay
    const wordObservables = words.map((word, index) => 
      of(word + (index === words.length - 1 ? '' : ' ')).pipe(
        delay(index * 60 + Math.random() * 40) // incremental delay for word streaming
      )
    );

    return concat(...wordObservables);
  }

  private getReply(subject: string, question: string): string {
    const subjectList = this.responses[subject] || [];
    for (const item of subjectList) {
      if (item.keywords.some(kw => question.includes(kw))) {
        return item.reply;
      }
    }
    
    // Fallback search across all subjects
    for (const sub in this.responses) {
      for (const item of this.responses[sub]) {
        if (item.keywords.some(kw => question.includes(kw))) {
          return `[Related to ${sub.toUpperCase()}]: ${item.reply}`;
        }
      }
    }

    return this.defaultReplies[Math.floor(Math.random() * this.defaultReplies.length)];
  }
}
