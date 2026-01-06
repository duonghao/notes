"use client";
import { useState } from "react";

interface Note {
  to: string;
  message: string;
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);

  return (
    <section>
      <h1 className="text-xl font-bold mb-4!">Notes</h1>
      <div className="flex gap-8">
        <aside>
          <form
            className="space-y-4! border p-8! aspect-square"
            onSubmit={(e) => {
              e.preventDefault();

              const formData = new FormData(e.currentTarget);

              setNotes((prev) => [
                ...prev,
                {
                  to: formData.get("to")?.toString() ?? "",
                  message: formData.get("message")?.toString() ?? "",
                },
              ]);
            }}
          >
            <div className="flex flex-col gap-1">
              <label htmlFor="to">To</label>
              <input id="to" name="to" />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" className="resize-none" />
            </div>

            <button type="submit">Send</button>
          </form>
        </aside>

        <article className="flex-1">
          <table className="w-full">
            <tbody className="grid grid-cols-6 gap-2">
              {notes.map((note, index) => {
                return (
                  <tr key={index} className="aspect-square border p-8!">
                    <td>
                      <h2 className="text-slate-400">{note.to}</h2>
                      <span>{note.message}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </article>
      </div>
    </section>
  );
}
